# 信頼ポリシー
data "aws_iam_policy_document" "scheduler_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["scheduler.amazonaws.com"]
    }
  }
}

# ==============================
# Notification
# ==============================
# スケジュールグループ
resource "aws_scheduler_schedule_group" "notification" {
  name = "notification"
}

# IAMロール
resource "aws_iam_role" "scheduler_notification" {
  name               = "scheduler-notification"
  assume_role_policy = data.aws_iam_policy_document.scheduler_assume.json
}

data "aws_iam_policy_document" "scheduler_notification" {
  statement {
    actions   = ["lambda:InvokeFunction"]
    resources = [aws_lambda_function.notification_fanout.arn]
  }
}

resource "aws_iam_policy" "scheduler_notification" {
  name   = "scheduler-notification"
  policy = data.aws_iam_policy_document.scheduler_notification.json
}

resource "aws_iam_role_policy_attachment" "scheduler_notification" {
  role       = aws_iam_role.scheduler_notification.name
  policy_arn = aws_iam_policy.scheduler_notification.arn
}
