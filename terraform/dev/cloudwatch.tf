# ==============================
# DLQ Notification Worker
# ==============================
# 5分間に1件以上のデッドレターキューにメッセージが存在する場合にアラームを発生させる
resource "aws_cloudwatch_metric_alarm" "dlq_notification_worker" {
  alarm_name          = "notification-dead-letter"
  alarm_description   = "notification-dead-letterにメッセージが存在する"
  namespace           = "AWS/SQS"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  statistic           = "Sum"
  period              = 300
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  dimensions = {
    QueueName = aws_sqs_queue.notification_dead_letter.name
  }
  alarm_actions = [aws_sns_topic.cloudwatch_alarm.arn]
  ok_actions    = [aws_sns_topic.cloudwatch_alarm.arn]
}
