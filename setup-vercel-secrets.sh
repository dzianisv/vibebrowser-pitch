#!/bin/bash

echo "Setting up Vercel deployment secrets for GitHub Actions"
echo "======================================================="
echo ""
echo "Step 1: Generate a Vercel token"
echo "--------------------------------"
echo "Go to: https://vercel.com/account/tokens"
echo "Click 'Create Token', give it a name like 'github-actions-pitch'"
echo ""
read -p "Enter your Vercel token: " VERCEL_TOKEN
echo ""

echo "Step 2: Setting up GitHub secrets..."
echo "------------------------------------"

# Set the secrets
gh secret set VERCEL_TOKEN --body "$VERCEL_TOKEN" --repo dzianisv/vibebrowser-pitch
gh secret set VERCEL_ORG_ID --body "team_vF4d4Phgfv1IqW1MEZw7mBre" --repo dzianisv/vibebrowser-pitch
gh secret set VERCEL_PROJECT_ID --body "prj_tmtZ3Z64ikng88hNavtdM4QcyeHu" --repo dzianisv/vibebrowser-pitch

echo ""
echo "✅ GitHub secrets have been configured!"
echo ""
echo "Step 3: Configure DNS"
echo "---------------------"
echo "Add this DNS record in your Cloudflare dashboard for vibebrowser.app:"
echo ""
echo "Type: CNAME"
echo "Name: pitch"
echo "Target: cname.vercel-dns.com"
echo ""
echo "Alternative (if CNAME doesn't work):"
echo "Type: A"
echo "Name: pitch"
echo "IP: 76.76.21.21"
echo ""
echo "Once DNS is configured, the site will be available at: https://pitch.vibebrowser.app"