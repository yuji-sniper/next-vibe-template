variable "vercel_cname_target" {
  type        = string
  description = "The CNAME target of the Vercel deployment"
}

variable "vercel_team_slug" {
  type        = string
  description = "The team slug of the Vercel project"
}

variable "vercel_project" {
  type        = string
  description = "The project of the Vercel project"
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

variable "slack_channel_id" {
  type        = string
  description = "The ID of the Slack channel"
}

variable "slack_team_id" {
  type        = string
  description = " ID of the Slack workspace authorized with AWS Chatbot"
}
