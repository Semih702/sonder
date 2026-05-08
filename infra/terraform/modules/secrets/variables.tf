variable "name_prefix" {
  type = string
}

variable "database_url" {
  type      = string
  sensitive = true
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "admin_secret" {
  type      = string
  sensitive = true
}

