output "api_base_url" {
  description = "HTTP API base URL for EXPO_PUBLIC_API_BASE_URL."
  value       = module.api_gateway.api_endpoint
}

output "lambda_function_name" {
  value = module.api_lambda.function_name
}

output "pinpoint_application_id" {
  value = module.messaging_push.application_id
}

output "secret_arns" {
  value     = module.secrets.secret_arns
  sensitive = true
}

