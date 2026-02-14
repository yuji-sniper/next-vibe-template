# 信頼ポリシー
data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# ==============================
# notification fanout
# ==============================
# CloudWatch log group
resource "aws_cloudwatch_log_group" "notification_fanout" {
  name              = "/lambda/notification-fanout"
  retention_in_days = 30
}

# IAMロール
resource "aws_iam_role" "notification_fanout" {
  name               = "notification-fanout"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "notification_fanout_basic" {
  role       = aws_iam_role.notification_fanout.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "notification_fanout" {
  statement {
    actions   = ["sqs:SendMessage"]
    resources = [aws_sqs_queue.notification.arn]
  }
}

resource "aws_iam_policy" "notification_fanout" {
  name   = "notification-fanout"
  policy = data.aws_iam_policy_document.notification_fanout.json
}

resource "aws_iam_role_policy_attachment" "notification_fanout" {
  role       = aws_iam_role.notification_fanout.name
  policy_arn = aws_iam_policy.notification_fanout.arn
}

# S3 オブジェクト
resource "null_resource" "notification_fanout_build" {
  triggers = {
    source_hash = sha1(join("", [for f in fileset("${path.module}/sources/lambda_functions/notification_fanout/src", "**/*.ts") : filesha1("${path.module}/sources/lambda_functions/notification_fanout/src/${f}")]))
  }

  provisioner "local-exec" {
    command     = "pnpm build"
    working_dir = "${path.module}/sources/lambda_functions/notification_fanout"
  }
}

data "archive_file" "notification_fanout" {
  type        = "zip"
  source_file = "${path.module}/sources/lambda_functions/notification_fanout/dist/index.js"
  output_path = "${path.module}/outputs/lambda_functions/notification_fanout.zip"

  depends_on = [null_resource.notification_fanout_build]
}

resource "aws_s3_object" "notification_fanout" {
  bucket = aws_s3_bucket.lambda_function.id
  key    = "notification-fanout.zip"
  source = data.archive_file.notification_fanout.output_path
  etag   = data.archive_file.notification_fanout.output_md5
}

# Lambda 関数
resource "aws_lambda_function" "notification_fanout" {
  function_name    = "notification-fanout"
  role             = aws_iam_role.notification_fanout.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  s3_bucket        = aws_s3_bucket.lambda_function.id
  s3_key           = aws_s3_object.notification_fanout.key
  source_code_hash = data.archive_file.notification_fanout.output_base64sha256
  timeout          = 300
  memory_size      = 256
  publish          = true
  logging_config {
    log_group  = aws_cloudwatch_log_group.notification_fanout.name
    log_format = "JSON"
  }
  environment {
    variables = {
      WORKER_QUEUE_URL = aws_sqs_queue.notification.url
      DB_HOST          = var.db_host
      DB_PORT          = var.db_port
      DB_USER          = var.db_user
      DB_PASSWORD      = "dummy"
      DB_NAME          = var.db_name
    }
  }
  depends_on = [
    aws_cloudwatch_log_group.notification_fanout,
    aws_iam_role_policy_attachment.notification_fanout,
    aws_iam_role_policy_attachment.notification_fanout
  ]

  lifecycle {
    ignore_changes = [environment]
  }
}

# ==============================
# Notification worker
# ==============================
# CloudWatch log group
resource "aws_cloudwatch_log_group" "notification_worker" {
  name              = "/lambda/notification-worker"
  retention_in_days = 30
}

# IAMロール
resource "aws_iam_role" "notification_worker" {
  name               = "notification-worker"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "notification_worker_basic" {
  role       = aws_iam_role.notification_worker.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "notification_worker_sqs" {
  role       = aws_iam_role.notification_worker.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

data "aws_iam_policy_document" "notification_worker" {
  statement {
    actions   = ["ses:SendBulkEmail"]
    resources = [aws_ses_domain_identity.main.arn]
  }
}

resource "aws_iam_policy" "notification_worker" {
  name   = "notification-worker"
  policy = data.aws_iam_policy_document.notification_worker.json
}

resource "aws_iam_role_policy_attachment" "notification_worker_ses" {
  role       = aws_iam_role.notification_worker.name
  policy_arn = aws_iam_policy.notification_worker.arn
}

# S3 オブジェクト
resource "null_resource" "notification_worker_build" {
  triggers = {
    source_hash = sha1(join("", [for f in fileset("${path.module}/sources/lambda_functions/notification_worker/src", "**/*.ts") : filesha1("${path.module}/sources/lambda_functions/notification_worker/src/${f}")]))
  }

  provisioner "local-exec" {
    command     = "pnpm build"
    working_dir = "${path.module}/sources/lambda_functions/notification_worker"
  }
}

data "archive_file" "notification_worker" {
  type        = "zip"
  source_file = "${path.module}/sources/lambda_functions/notification_worker/dist/index.js"
  output_path = "${path.module}/outputs/lambda_functions/notification_worker.zip"

  depends_on = [null_resource.notification_worker_build]
}

resource "aws_s3_object" "notification_worker" {
  bucket = aws_s3_bucket.lambda_function.id
  key    = "notification-worker.zip"
  source = data.archive_file.notification_worker.output_path
  etag   = data.archive_file.notification_worker.output_md5
}

# Lambda 関数
resource "aws_lambda_function" "notification_worker" {
  function_name    = "notification-worker"
  role             = aws_iam_role.notification_worker.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"
  s3_bucket        = aws_s3_bucket.lambda_function.id
  s3_key           = aws_s3_object.notification_worker.key
  source_code_hash = data.archive_file.notification_worker.output_base64sha256
  timeout          = 300
  memory_size      = 256
  publish          = true
  # reserved_concurrent_executions = 2
  logging_config {
    log_group  = aws_cloudwatch_log_group.notification_worker.name
    log_format = "JSON"
  }
  environment {
    variables = {
      FROM_EMAIL  = "noreply@${local.domain}"
      DB_HOST     = var.db_host
      DB_PORT     = var.db_port
      DB_USER     = var.db_user
      DB_PASSWORD = "dummy"
      DB_NAME     = var.db_name
    }
  }
  depends_on = [
    aws_cloudwatch_log_group.notification_worker,
    aws_iam_role_policy_attachment.notification_worker_basic,
    aws_iam_role_policy_attachment.notification_worker_sqs,
  ]

  lifecycle {
    ignore_changes = [environment]
  }
}

# SQSイベントソースマッピング
resource "aws_lambda_event_source_mapping" "notification_worker" {
  event_source_arn = aws_sqs_queue.notification.arn
  function_name    = aws_lambda_function.notification_worker.function_name
  # batch_size       = 2
}
