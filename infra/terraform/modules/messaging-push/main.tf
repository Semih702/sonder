resource "aws_pinpoint_app" "this" {
  name = "${var.name_prefix}-push"
}

resource "aws_pinpoint_apns_channel" "this" {
  count          = var.enable_apns_channel ? 1 : 0
  application_id = aws_pinpoint_app.this.application_id
  enabled        = true

  default_authentication_method = "TOKEN"
  bundle_id                     = var.apns_bundle_id
  team_id                       = var.apns_team_id
  token_key_id                  = var.apns_key_id
  token_key                     = var.apns_token_key
}

resource "aws_pinpoint_gcm_channel" "this" {
  count          = var.enable_fcm_channel ? 1 : 0
  application_id = aws_pinpoint_app.this.application_id
  enabled        = true
  api_key        = var.fcm_server_key
}

