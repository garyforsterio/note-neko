resource "google_compute_network" "vpc" {
  name                    = "nextjs-gke-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "nextjs-gke-subnet"
  region        = "asia-northeast1"
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.0.0.0/16"
}

resource "google_container_cluster" "primary" {
  name     = "nextjs-autopilot-cluster"
  location = "asia-northeast1"
  
  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  # Allow deletion of the cluster
  deletion_protection = false

  # Enable Autopilot
  enable_autopilot = true

  # Explicitly empty config required for Autopilot
  ip_allocation_policy {
  }
}