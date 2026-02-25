resource "google_artifact_registry_repository" "nextjs_repo" {
  location      = "asia-northeast1"
  repository_id = "nextjs-repo"
  description   = "Docker repository for Next.js app"
  format        = "DOCKER"
}

resource "google_compute_global_address" "nextjs_static_ip" {
  name = "nextjs-global-ip"
}

output "global_ip_address" {
  value = google_compute_global_address.nextjs_static_ip.address
}