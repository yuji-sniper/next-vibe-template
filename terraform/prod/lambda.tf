################################################################################
# メール処理 Lambda
################################################################################
# ソースコードのzip化
data "archive_file" "email_processor" {
  type        = "zip"
  source_dir  = "${path.module}/lambda/email-processor"
  output_path = "${path.module}/lambda/email-processor.zip"
}

resource "aws_s3_object" "email_processor" {
  bucket = aws_s3_bucket.lambda_function.id
  key    = "email-processor.zip"
  source = data.archive_file.email_processor.output_path
  etag   = data.archive_file.email_processor.output_md5
}

# IAMロール
data "aws_iam_policy_document" "email_processor_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "email_processor" {
  name               = "email-processor-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.email_processor_assume_role.json
}

resource "aws_iam_role_policy_attachment" "email_processor_lambda_basic" {
  role       = aws_iam_role.email_processor.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# S3読み取りポリシー
data "aws_iam_policy_document" "email_processor_s3" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.mail.arn}/*"]
  }
}

resource "aws_iam_policy" "email_processor_s3" {
  name   = "email-processor-s3-read"
  policy = data.aws_iam_policy_document.email_processor_s3.json
}

resource "aws_iam_role_policy_attachment" "email_processor_s3" {
  role       = aws_iam_role.email_processor.name
  policy_arn = aws_iam_policy.email_processor_s3.arn
}

# CloudWatch Logs
resource "aws_cloudwatch_log_group" "email_processor" {
  name              = "/lambda/email-processor"
  retention_in_days = 30
}

# Lambda関数
resource "aws_lambda_function" "email_processor" {
  function_name    = "email-processor"
  role             = aws_iam_role.email_processor.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  s3_bucket        = aws_s3_bucket.lambda_function.id
  s3_key           = aws_s3_object.email_processor.key
  source_code_hash = data.archive_file.email_processor.output_base64sha256
  publish          = true
  memory_size      = 256
  timeout          = 30

  logging_config {
    log_group  = aws_cloudwatch_log_group.email_processor.name
    log_format = "JSON"
  }

  environment {
    variables = {
      DATABASE_HOST     = var.database_host
      DATABASE_PORT     = var.database_port
      DATABASE_USER     = var.database_user
      DATABASE_PASSWORD = "dummy"
      DATABASE_NAME     = var.database_name
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.email_processor_lambda_basic,
    aws_iam_role_policy_attachment.email_processor_s3,
  ]
}

# S3からの呼び出し許可
resource "aws_lambda_permission" "email_processor" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_processor.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.mail.arn
}
