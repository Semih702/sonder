locals {
  name_prefix   = "${var.project_name}-${var.environment}"
  function_name = "${local.name_prefix}-api"
}

module "secrets" {
  source = "./modules/secrets"

  name_prefix  = local.name_prefix
  database_url = var.database_url
  jwt_secret   = var.jwt_secret
  admin_secret = var.admin_secret
}

module "messaging_push" {
  source = "./modules/messaging-push"

  name_prefix         = local.name_prefix
  enable_apns_channel = var.enable_apns_channel
  apns_bundle_id      = var.apns_bundle_id
  apns_team_id        = var.apns_team_id
  apns_key_id         = var.apns_key_id
  apns_token_key      = var.apns_token_key
  enable_fcm_channel  = var.enable_fcm_channel
  fcm_server_key      = var.fcm_server_key
}

module "monitoring" {
  source = "./modules/monitoring"

  lambda_function_name = local.function_name
  log_retention_days   = var.log_retention_days
}

module "api_lambda" {
  source = "./modules/api-lambda"

  function_name               = local.function_name
  lambda_zip_path             = var.lambda_zip_path
  handler                     = var.lambda_handler
  runtime                     = var.lambda_runtime
  memory_mb                   = var.lambda_memory_mb
  timeout_seconds             = var.lambda_timeout_seconds
  pinpoint_application_arn    = module.messaging_push.application_arn
  secrets_manager_secret_arns = module.secrets.secret_arns

  environment_variables = {
    NODE_ENV                    = "production"
    DATABASE_URL                = var.database_url
    JWT_SECRET                  = var.jwt_secret
    AWS_REGION                  = var.aws_region
    AWS_PINPOINT_APPLICATION_ID = module.messaging_push.application_id
    INVITE_ONLY_MODE            = tostring(var.invite_only_mode)
    POSTING_ENABLED             = tostring(var.posting_enabled)
    PUSH_NOTIFICATIONS_ENABLED  = tostring(var.push_notifications_enabled)
    MAINTENANCE_MODE            = tostring(var.maintenance_mode)
    ADMIN_DASHBOARD_ENABLED     = tostring(var.admin_dashboard_enabled)
    ADMIN_SECRET                = var.admin_secret
    REQUEST_TIMEOUT_MS          = "10000"
  }

  depends_on = [module.monitoring]
}

module "api_gateway" {
  source = "./modules/api-gateway"

  name_prefix          = local.name_prefix
  lambda_function_name = module.api_lambda.function_name
  lambda_invoke_arn    = module.api_lambda.invoke_arn
  custom_domain_name   = var.custom_domain_name
  certificate_arn      = var.certificate_arn
}

