
output "backend_url" {
  description = "Public URL of the backend Container App"
  value       = "https://${azurerm_container_app.myapp_container.latest_revision_fqdn}"
}

output "website_url" {
  description = "Public URL of the frontend"
  value       = azurerm_storage_account.myapp_frontend.primary_web_endpoint
}

output "storage_account_name" {
  description = "Needed to upload the files (az storage blob upload-batch --account-name ...)"
  value       = azurerm_storage_account.myapp_frontend.name
}