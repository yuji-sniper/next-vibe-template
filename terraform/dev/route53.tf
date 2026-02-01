data "aws_route53_zone" "main" {
  name = local.domain
}

resource "aws_route53_record" "main_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "dev"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

resource "aws_route53_record" "main_cname_admin" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "dev.admin"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}
