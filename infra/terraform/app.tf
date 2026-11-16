
resource "azurerm_resource_group" "myapp_rg" {
  name     = var.rg_app_name
  location = var.location
}

resource "azurerm_log_analytics_workspace" "myapp_logs" {
  name = "${var.project_name}-logs-${random_string.random_suffix.result}"

  resource_group_name = azurerm_resource_group.myapp_rg.name
  location            = azurerm_resource_group.myapp_rg.location

  sku               = "PerGB2018"
  retention_in_days = 30
}

resource "azurerm_container_app_environment" "myapp_env" {
  name = "${var.project_name}-env-${random_string.random_suffix.result}"

  resource_group_name = azurerm_resource_group.myapp_rg.name
  location            = azurerm_resource_group.myapp_rg.location

  log_analytics_workspace_id = azurerm_log_analytics_workspace.myapp_logs.id
}



resource "azurerm_container_app" "myapp_container" {
  name                         = "${var.project_name}-backend-${random_string.random_suffix.result}"
  resource_group_name          = azurerm_resource_group.myapp_rg.name
  container_app_environment_id = azurerm_container_app_environment.myapp_env.id

  revision_mode = "Single"

  # Secrets
  dynamic "secret" {
    for_each = local.app_secrets

    content {
      name  = secret.key
      value = secret.value
    }
  }

  # Container configuration
  template {
    min_replicas = 1
    max_replicas = 2

    container {
      name   = "backend"
      image  = "${var.api_image}:${var.git_commit_sha}"
      cpu    = 0.25
      memory = "0.5Gi"

      # Environment variables
      dynamic "env" {
        for_each = local.app_environment_variables

        content {
          name        = env.key
          value       = try(env.value.value, null)
          secret_name = try(env.value.secret_name, null)
        }
      }
    }
  }

  # Public HTTP endpoint
  ingress {
    external_enabled = true
    target_port      = 8080
    transport        = "auto"

    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}


resource "azurerm_storage_account" "myapp_frontend" {
  name                     = "${var.project_name}frontend${random_string.random_suffix.result}"
  resource_group_name      = azurerm_resource_group.myapp_rg.name
  location                 = azurerm_resource_group.myapp_rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS" # cheapest: 3 copies in one datacenter
}

# Turns on the static website: files in the "$web" container are served over HTTPS.
resource "azurerm_storage_account_static_website" "myapp_frontend" {
  storage_account_id = azurerm_storage_account.myapp_frontend.id
  index_document     = "index.html"
  error_404_document = "index.html"
}
