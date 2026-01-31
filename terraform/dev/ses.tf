################################################################################
# 送信
################################################################################
# ID
resource "aws_ses_domain_identity" "main" {
  domain = local.domain
}

# DKIM
resource "aws_ses_domain_dkim" "main" {
  domain = aws_ses_domain_identity.main.domain
}

resource "aws_route53_record" "main_dkim" {
  count   = 3
  zone_id = data.aws_route53_zone.main.id
  name    = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey.${aws_ses_domain_identity.main.domain}"
  type    = "CNAME"
  ttl     = 1800
  records = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# MAIL FROM
resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "bounce.dev.${aws_ses_domain_identity.main.domain}"
}

resource "aws_route53_record" "main_mail_from_mx" {
  zone_id = data.aws_route53_zone.main.id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = 300
  records = ["10 feedback-smtp.${local.region}.amazonses.com"]
}

resource "aws_route53_record" "main_mail_from_txt" {
  zone_id = data.aws_route53_zone.main.id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = 300
  records = ["v=spf1 include:amazonses.com ~all"]
}

# DMARC
resource "aws_route53_record" "main_dmarc" {
  zone_id = data.aws_route53_zone.main.id
  name    = "_dmarc.${aws_ses_domain_identity.main.domain}"
  type    = "TXT"
  ttl     = 300
  records = ["v=DMARC1; p=none;"]
}

################################################################################
# 受信
################################################################################
# ルールセット
resource "aws_ses_receipt_rule_set" "primary" {
  rule_set_name = "primary"
}

# ルール
resource "aws_ses_receipt_rule" "primary" {
  rule_set_name = aws_ses_receipt_rule_set.primary.rule_set_name
  name          = "store"
  enabled       = true
  tls_policy    = "Require"
  scan_enabled  = true
  recipients    = ["support@${aws_ses_domain_identity.main.domain}"]
  s3_action {
    bucket_name       = aws_s3_bucket.mail.id
    object_key_prefix = "emails/"
    position          = 1
  }
}

# 有効なルールセット
resource "aws_ses_active_receipt_rule_set" "primary" {
  rule_set_name = aws_ses_receipt_rule_set.primary.rule_set_name
}

# inbound　　MXレコード
resource "aws_route53_record" "main_inbound_mx" {
  zone_id = data.aws_route53_zone.main.id
  name    = aws_ses_domain_identity.main.domain
  type    = "MX"
  ttl     = 300
  records = ["10 inbound-smtp.${local.region}.amazonaws.com"]
}
