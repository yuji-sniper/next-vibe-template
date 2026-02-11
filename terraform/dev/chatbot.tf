# ==============================
# CloudWatch Alarm
# ==============================

# SlackのID確認方法
# https://slack.com/intl/ja-jp/help/articles/221769328-Slack-URL-%E3%81%BE%E3%81%9F%E3%81%AF-ID-%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B

# CloudWatch Alarm通知用SNSトピック
resource "aws_sns_topic" "cloudwatch_alarm" {
  name = "cloudwatch-alarm"
}

# IAMロール
data "aws_iam_policy_document" "chatbot" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["chatbot.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "chatbot" {
  name               = "chatbot"
  assume_role_policy = data.aws_iam_policy_document.chatbot.json
}

resource "aws_iam_role_policy_attachment" "chatbot" {
  role       = aws_iam_role.chatbot.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchReadOnlyAccess"
}

# CloudWatch Alarm通知用Chatbot設定
resource "aws_chatbot_slack_channel_configuration" "cloudwatch_alarm" {
  configuration_name = "cloudwatch-alarm"
  iam_role_arn       = aws_iam_role.chatbot.arn
  slack_channel_id   = var.slack_channel_id
  slack_team_id      = var.slack_team_id
  sns_topic_arns     = [aws_sns_topic.cloudwatch_alarm.arn]

  tags = {
    Name = "cloudwatch-alarm"
  }
}
