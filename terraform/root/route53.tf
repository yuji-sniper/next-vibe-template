data "aws_route53_zone" "main" {
  name = local.domain
}

# Production
resource "aws_route53_record" "prod_a" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = local.domain
  type    = "A"
  ttl     = 300
  records = ["216.150.1.1"]
}

resource "aws_route53_record" "prod_www_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

resource "aws_route53_record" "prod_admin_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "admin"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

# Development
resource "aws_route53_record" "dev_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "dev"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

resource "aws_route53_record" "dev_admin_cname" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "dev.admin"
  type    = "CNAME"
  ttl     = 300
  records = [var.vercel_cname_target]
}

