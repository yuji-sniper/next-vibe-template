# ==============================
# Notification
# ==============================
# デッドレター用キュー
resource "aws_sqs_queue" "notification_dead_letter" {
  name = "notification-dead-letter"

  message_retention_seconds = 4 * 86400 # 4 days
}

# キュー
resource "aws_sqs_queue" "notification" {
  name = "notification"

  visibility_timeout_seconds = 300
  message_retention_seconds  = 4 * 86400 # 4 days
  receive_wait_time_seconds  = 20

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.notification_dead_letter.arn
    maxReceiveCount     = 3
  })
}

# TODO: CloudWatch AlarmでDLQメッセージ数が閾値を超えたら通知する
# 参考: https://docs.aws.amazon.com/ja_jp/AWSSimpleQueueService/latest/SQSDeveloperGuide/set-cloudwatch-alarms-for-metrics.html
