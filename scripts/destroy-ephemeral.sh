#!/bin/bash
set -e

echo "🔥 Step 1: Destroying Ephemeral Infrastructure..."
cd ./terraform/ephemeral
terraform destroy -auto-approve
echo "✅ Infrastructure removed. Billing stopped."