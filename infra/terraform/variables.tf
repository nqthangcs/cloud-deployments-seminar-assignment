# Inputs. Set them in terraform.tfvars (see terraform.tfvars.example), with -var on the command line,
# or as environment variables named TF_VAR_<name>.

variable "subscription_id" {
  description = "Azure subscription to create the resources in (az account show --query id -o tsv)"
  type        = string
}

variable "location" {
  description = "Azure region. Student subscriptions allow only some regions: pick another on a policy error."
  type        = string
  default     = "malaysiawest"
}



variable "project_name" {
  description = "Project name"
  type        = string
  default     = "assignment"
}



variable "rg_database_name" {
  description = "Resource group for the database. terraform destroy deletes it with everything inside."
  type        = string
  default     = "rg-assignment-database"
}

variable "rg_app_name" {
  description = "Resource group for the frontend and backend. terraform destroy deletes it with everything inside."
  type        = string
  default     = "rg-assignment-app"
}



variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "updateinterraformtfvars"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "postgres_database_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "myapp"
}




variable "container_app_environment_variables" {
  description = "Custom environment variables for Container App"

  type = map(object({
    value       = optional(string)
    secret_name = optional(string)
  }))

  default = {}
}

variable "container_app_secrets" {
  description = "Additional Container App secrets"

  type    = map(string)
  default = {}
}

variable "api_image" {
  description = "Docker image repository without tag"
  type        = string
  default     = "thanguyen165/seminar-backend"
}

variable "git_commit_sha" {
  description = "Git commit SHA used as Docker image tag"
  type        = string

  validation {
    condition     = can(regex("^[a-f0-9]{7,40}$", var.git_commit_sha))
    error_message = "git_commit_sha must be a valid Git SHA (7-40 lowercase hexadecimal characters)."
  }
}
