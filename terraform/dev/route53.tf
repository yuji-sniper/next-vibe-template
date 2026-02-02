resource "aws_route53_zone" "main" {
  name = local.domain
}

resource "aws_route53_record" "main_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

resource "aws_route53_record" "main_admin_cname" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "admin"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}
