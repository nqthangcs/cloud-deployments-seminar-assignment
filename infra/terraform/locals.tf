
locals {
  db_url = "postgresql+psycopg://${var.postgres_admin_username}:${urlencode(var.postgres_admin_password)}@${azurerm_postgresql_flexible_server.mydatabase_server.fqdn}:5432/${azurerm_postgresql_flexible_server_database.mydatabase_server_db.name}?sslmode=require"
}

locals {
  app_secrets = merge(
    {
      database-url = local.db_url
    },
    var.container_app_secrets
  )

  app_environment_variables = merge(
    {
      FLASK_PORT = {
        value = "8080"
      }

      APP_VERSION = {
        value = var.git_commit_sha
      }

      CORS_ORIGIN = {
        value = azurerm_storage_account.myapp_frontend.primary_web_endpoint
      }

      DB_URL = {
        secret_name = "database-url"
      }
    },
    var.container_app_environment_variables
  )
}