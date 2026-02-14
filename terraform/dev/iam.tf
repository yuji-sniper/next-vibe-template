# ==============================
# OIDC Vercel
# ==============================
# OIDC Provider
resource "aws_iam_openid_connect_provider" "vercel_oidc" {
  url            = "https://oidc.vercel.com/${var.vercel_team_slug}"
  client_id_list = ["https://vercel.com/${var.vercel_team_slug}"]
}

# IAM Role
data "aws_iam_policy_document" "vercel_oidc" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.vercel_oidc.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "oidc.vercel.com/${var.vercel_team_slug}:sub"
      values   = ["owner:${var.vercel_team_slug}:project:${var.vercel_project}:environment:dev"]
    }
  }
}

resource "aws_iam_role" "vercel_oidc" {
  name               = "vercel-oidc"
  assume_role_policy = data.aws_iam_policy_document.vercel_oidc.json
}

data "aws_iam_policy_document" "vercel_oidc_policy" {
  statement {
    actions = [
      "scheduler:CreateSchedule",
      "scheduler:UpdateSchedule",
      "scheduler:DeleteSchedule",
    ]
    resources = [
      "arn:aws:scheduler:${local.region}:${data.aws_caller_identity.current.account_id}:schedule/${aws_scheduler_schedule_group.notification.name}/*"
    ]
  }
  statement {
    actions = ["iam:PassRole"]
    resources = [
      aws_iam_role.scheduler_notification.arn
    ]
  }
}

resource "aws_iam_policy" "vercel_oidc_policy" {
  name   = "vercel-oidc-policy"
  policy = data.aws_iam_policy_document.vercel_oidc_policy.json
}

resource "aws_iam_role_policy_attachment" "vercel_oidc_policy" {
  role       = aws_iam_role.vercel_oidc.name
  policy_arn = aws_iam_policy.vercel_oidc_policy.arn
}
