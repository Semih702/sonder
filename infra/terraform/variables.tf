variable "project_name" {
  type        = string
  description = "Project name used for AWS resource names."
  default     = "sonder"
}

variable "environment" {
  type        = string
  description = "Deployment environment name."
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS region."
  default     = "us-east-1"
}

variable "lambda_zip_path" {
  type        = string
  description = "Path to the built API Lambda zip artifact."
  default     = "../../lambda-artifact/api.zip"
}

variable "lambda_handler" {
  type        = string
  description = "Lambda handler. Keep configurable for OpenNext or Lambda Web Adapter packaging."
  default     = "index.handler"
}

variable "lambda_runtime" {
  type        = string
  description = "Lambda runtime."
  default     = "nodejs20.x"
}

variable "lambda_memory_mb" {
  type        = number
  description = "Lambda memory size."
  default     = 512
}

variable "lambda_timeout_seconds" {
  type        = number
  description = "Lambda timeout."
  default     = 15
}

variable "log_retention_days" {
  type        = number
  description = "CloudWatch log retention."
  default     = 7
}

variable "database_url" {
  type        = string
  description = "PostgreSQL connection string. Prefer Neon/Supabase pooled Postgres for the first beta."
  sensitive   = true
}

variable "jwt_secret" {
  type        = string
  description = "JWT signing secret."
  sensitive   = true
}

variable "admin_secret" {
  type        = string
  description = "Admin API shared secret."
  sensitive   = true
}

variable "invite_only_mode" {
  type    = bool
  default = true
}

variable "posting_enabled" {
  type    = bool
  default = true
}

variable "push_notifications_enabled" {
  type    = bool
  default = false
}

variable "maintenance_mode" {
  type    = bool
  default = false
}

variable "admin_dashboard_enabled" {
  type    = bool
  default = false
}

variable "custom_domain_name" {
  type        = string
  description = "Optional API custom domain name."
  default     = ""
}

variable "certificate_arn" {
  type        = string
  description = "Optional ACM certificate ARN for the API custom domain."
  default     = ""
}

variable "enable_apns_channel" {
  type    = bool
  default = false
}

variable "apns_bundle_id" {
  type    = string
  default = ""
}

variable "apns_team_id" {
  type      = string
  default   = ""
  sensitive = true
}

variable "apns_key_id" {
  type      = string
  default   = ""
  sensitive = true
}

variable "apns_token_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "enable_fcm_channel" {
  type    = bool
  default = false
}

variable "fcm_server_key" {
  type      = string
  default   = ""
  sensitive = true
}

