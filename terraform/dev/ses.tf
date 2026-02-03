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
  zone_id = aws_route53_zone.main.zone_id
  name    = "${aws_ses_domain_dkim.main.dkim_tokens[count.index]}._domainkey.${local.domain}"
  type    = "CNAME"
  ttl     = 1800
  records = ["${aws_ses_domain_dkim.main.dkim_tokens[count.index]}.dkim.amazonses.com"]
}

# MAIL FROM
resource "aws_ses_domain_mail_from" "main" {
  domain           = aws_ses_domain_identity.main.domain
  mail_from_domain = "bounce.${local.domain}"
}

resource "aws_route53_record" "main_mail_from_mx" {
  zone_id = aws_route53_zone.main.zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "MX"
  ttl     = 300
  records = ["10 feedback-smtp.${local.region}.amazonses.com"]
}

resource "aws_route53_record" "main_mail_from_txt" {
  zone_id = aws_route53_zone.main.zone_id
  name    = aws_ses_domain_mail_from.main.mail_from_domain
  type    = "TXT"
  ttl     = 300
  records = ["v=spf1 include:amazonses.com ~all"]
}

# DMARC
resource "aws_route53_record" "main_dmarc" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "_dmarc.${local.domain}"
  type    = "TXT"
  ttl     = 300
  records = ["v=DMARC1; p=none;"]
}
