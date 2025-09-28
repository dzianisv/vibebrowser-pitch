#!/bin/bash

# Instructions to set up GitHub secrets for Netlify deployment
# Replace the placeholders with your actual values

# 1. Get your Netlify Auth Token:
#    Go to: https://app.netlify.com/user/applications#personal-access-tokens
#    Create a new token and copy it

# 2. Get your Netlify Site ID:
#    Go to your site settings in Netlify
#    Copy the API ID from Site Information

# Replace these with your actual values:
NETLIFY_AUTH_TOKEN="YOUR_NETLIFY_AUTH_TOKEN_HERE"
NETLIFY_SITE_ID="YOUR_NETLIFY_SITE_ID_HERE"

# Set the secrets in GitHub repository
echo "Setting up GitHub secrets..."
gh secret set NETLIFY_AUTH_TOKEN --body "$NETLIFY_AUTH_TOKEN" --repo dzianisv/vibebrowser-pitch
gh secret set NETLIFY_SITE_ID --body "$NETLIFY_SITE_ID" --repo dzianisv/vibebrowser-pitch

echo "Secrets have been configured!"
echo ""
echo "Next steps:"
echo "1. Push your code to trigger the deployment"
echo "2. Configure custom domain pitch.vibebrowser.app in Netlify site settings"