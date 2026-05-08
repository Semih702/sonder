# Sonder Terraform

This Terraform creates the initial low-cost beta infrastructure:

- API Gateway HTTP API
- Lambda API function
- Lambda IAM role and CloudWatch logs
- Secrets Manager entries for database/JWT/admin secrets
- AWS End User Messaging Push resources exposed by Terraform under Pinpoint names

It intentionally does not create NAT Gateway, ALB, ECS, EKS, or EC2 resources for the beta.

## Deploy

1. Build and package the API Lambda artifact into `lambda-artifact/api.zip`.
2. Copy `terraform.tfvars.example` or `envs/dev.tfvars.example` and fill in real values.
3. Run:

```sh
terraform init
terraform plan -var-file=envs/dev.tfvars
terraform apply -var-file=envs/dev.tfvars
```

`database_url`, `jwt_secret`, APNs values, FCM values, and `admin_secret` are sensitive. Do not commit real tfvars files.

## Push Naming

AWS currently documents End User Messaging Push SDK sends through the Pinpoint `SendMessages` API. The Terraform AWS provider also exposes mobile push resources with `aws_pinpoint_*` resource names, so this module uses `aws_pinpoint_app`, `aws_pinpoint_apns_channel`, and `aws_pinpoint_gcm_channel`.

APNs and Firebase credentials still require Apple Developer and Firebase setup outside Terraform. If your account requires newer FCM v1 credential configuration that is not represented by the Terraform resource, create the channel in the AWS console and keep `enable_fcm_channel = false`.

