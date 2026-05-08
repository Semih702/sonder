variable "function_name" {
  type = string
}

variable "lambda_zip_path" {
  type = string
}

variable "handler" {
  type = string
}

variable "runtime" {
  type = string
}

variable "memory_mb" {
  type = number
}

variable "timeout_seconds" {
  type = number
}

variable "environment_variables" {
  type      = map(string)
  sensitive = true
}

variable "pinpoint_application_arn" {
  type = string
}

variable "secrets_manager_secret_arns" {
  type = list(string)
}

