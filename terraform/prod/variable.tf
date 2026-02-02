variable "vercel_cname_target" {
  type        = string
  description = "The target of the Vercel CNAME"
}

variable "dev_name_servers" {
  type        = list(string)
  description = "The name servers of the development environment"
}

variable "database_host" {
  type        = string
  description = "The host of the database"
}

variable "database_port" {
  type        = number
  description = "The port of the database"
}

variable "database_user" {
  type        = string
  description = "The user of the database"
}

variable "database_name" {
  type        = string
  description = "The name of the database"
}
