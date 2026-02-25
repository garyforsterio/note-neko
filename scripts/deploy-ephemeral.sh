#!/bin/bash
set -e

PROJECT_ID="life-tracker-459800" 
REGION="asia-northeast1"
CLUSTER_NAME="nextjs-autopilot-cluster"

echo "🚀 Step 1: Spinning up ephemeral infrastructure..."
cd ./terraform/ephemeral
terraform apply -auto-approve
cd ../..

echo "🔗 Step 2: Connecting to GKE Cluster..."
gcloud container clusters get-credentials $CLUSTER_NAME \
    --region $REGION \
    --project $PROJECT_ID

echo "🔐 Step 3: Syncing Secrets from .env..."
# Refresh the secret so it always matches latest .env
kubectl delete secret nextjs-secrets --ignore-not-found
kubectl create secret generic nextjs-secrets --from-env-file=.env

echo "📦 Step 4: Applying Kustomize manifests..."
kubectl apply -k k8s/overlays/prod

echo "✨ Success! Infrastructure is up and app is deployed."