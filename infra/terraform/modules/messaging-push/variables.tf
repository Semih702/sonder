variable "name_prefix" {
  type = string
}

variable "enable_apns_channel" {
  type = bool
}

variable "apns_bundle_id" {
  type = string
}

variable "apns_team_id" {
  type      = string
  sensitive = true
}

variable "apns_key_id" {
  type      = string
  sensitive = true
}

variable "apns_token_key" {
  type      = string
  sensitive = true
}

variable "enable_fcm_channel" {
  type = bool
}

variable "fcm_server_key" {
  type      = string
  sensitive = true
}

