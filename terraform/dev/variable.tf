variable "vercel_cname_target" {
  type        = string
  description = "The CNAME target of the Vercel deployment"
}

variable "db_host" {
  type        = string
  description = "The host of the database"
}

variable "db_port" {
  type        = number
  description = "The port of the database"
}

variable "db_user" {
  type        = string
  description = "The user of the database"
}

variable "db_name" {
  type        = string
  description = "The name of the database"
}
