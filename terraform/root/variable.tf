variable "vercel_cname_target" {
  type        = string
  description = "The target of the Vercel CNAME"
}

variable "dev_name_servers" {
  type        = list(string)
  description = "The name servers of the development environment"
}
