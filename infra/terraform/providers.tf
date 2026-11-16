
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm" # plugin that talks to the Azure API
      version = "~> 4.81"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.9.1"
    }
  }
}


provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}
