terraform {
  required_version = ">= 1.14.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

provider "google" {
  project = "life-tracker-459800"
  region  = "asia-northeast1"
}