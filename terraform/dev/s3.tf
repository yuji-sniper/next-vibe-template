data "aws_caller_identity" "current" {}

locals {
  receipt_rule_set = "primary"
  receipt_rule     = "store"
}

################################################################################
# メール
################################################################################
resource "aws_s3_bucket" "mail" {
  bucket        = "mail-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "mail" {
  bucket = aws_s3_bucket.mail.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "mail" {
  bucket                  = aws_s3_bucket.mail.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "mail" {
  bucket = aws_s3_bucket.mail.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }

}

resource "aws_s3_bucket_versioning" "mail" {
  bucket = aws_s3_bucket.mail.id
  versioning_configuration {
    status = "Enabled"
  }
}

data "aws_iam_policy_document" "mail" {
  statement {
    sid    = "AllowSESPuts"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.mail.id}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values   = [data.aws_caller_identity.current.account_id]
    }
    condition {
      test     = "StringEquals"
      variable = "aws:SourceArn"
      values   = ["arn:aws:ses:${local.region}:${data.aws_caller_identity.current.account_id}:receipt-rule-set/${local.receipt_rule_set}:receipt-rule/${local.receipt_rule}"]
    }
  }
}

resource "aws_s3_bucket_policy" "mail" {
  bucket = aws_s3_bucket.mail.id
  policy = data.aws_iam_policy_document.mail.json
}

# S3 → Lambda通知
resource "aws_s3_bucket_notification" "mail" {
  bucket = aws_s3_bucket.mail.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.email_processor.arn
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.email_processor]
}

################################################################################
# Lambda関数
################################################################################
resource "aws_s3_bucket" "lambda_function" {
  bucket        = "lambda-function-${data.aws_caller_identity.current.account_id}"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "lambda_function" {
  bucket = aws_s3_bucket.lambda_function.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "lambda_function" {
  bucket                  = aws_s3_bucket.lambda_function.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "lambda_function" {
  bucket = aws_s3_bucket.lambda_function.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "lambda_function" {
  bucket = aws_s3_bucket.lambda_function.id
  versioning_configuration {
    status = "Enabled"
  }
}
