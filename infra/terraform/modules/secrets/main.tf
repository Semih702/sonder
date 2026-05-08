resource "aws_secretsmanager_secret" "database_url" {
  name = "${var.name_prefix}/database-url"
}

resource "aws_secretsmanager_secret_version" "database_url" {
  secret_id     = aws_secretsmanager_secret.database_url.id
  secret_string = var.database_url
}

resource "aws_secretsmanager_secret" "jwt_secret" {
  name = "${var.name_prefix}/jwt-secret"
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id     = aws_secretsmanager_secret.jwt_secret.id
  secret_string = var.jwt_secret
}

resource "aws_secretsmanager_secret" "admin_secret" {
  name = "${var.name_prefix}/admin-secret"
}

resource "aws_secretsmanager_secret_version" "admin_secret" {
  secret_id     = aws_secretsmanager_secret.admin_secret.id
  secret_string = var.admin_secret
}

