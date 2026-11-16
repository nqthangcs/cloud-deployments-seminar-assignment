
resource "azurerm_resource_group" "mydatabase_rg" {
  name     = var.rg_database_name
  location = var.location
}

resource "azurerm_postgresql_flexible_server" "mydatabase_server" {
  name = "${var.project_name}-psql-${random_string.random_suffix.result}"

  resource_group_name = azurerm_resource_group.mydatabase_rg.name
  location            = azurerm_resource_group.mydatabase_rg.location

  version = "17"

  administrator_login    = var.postgres_admin_username
  administrator_password = var.postgres_admin_password

  sku_name   = "B_Standard_B1ms"
  storage_mb = 32768

  backup_retention_days = 7

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [zone]
  }
}

resource "azurerm_postgresql_flexible_server_database" "mydatabase_server_db" {
  name      = var.postgres_database_name
  server_id = azurerm_postgresql_flexible_server.mydatabase_server.id
  charset   = "UTF8"
  collation = "en_US.utf8"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_postgresql_flexible_server.mydatabase_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
