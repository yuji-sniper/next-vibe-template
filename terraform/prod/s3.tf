data "aws_caller_identity" "current" {}

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
