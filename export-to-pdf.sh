#!/bin/bash

echo "VibeBrowser Pitch Deck - PDF Export"
echo "===================================="
echo ""
echo "Method 1: Browser Print (Recommended)"
echo "--------------------------------------"
echo "1. Open: https://pitch.vibebrowser.app/?print-pdf"
echo "   Or locally: open index.html?print-pdf"
echo "2. Press Cmd+P (Mac) or Ctrl+P (Windows/Linux)"
echo "3. Select 'Save as PDF'"
echo "4. Settings:"
echo "   - Layout: Landscape"
echo "   - Paper size: A4 or Letter"
echo "   - Margins: None"
echo "   - Background graphics: ON"
echo ""
echo "Method 2: Using Decktape (Automated)"
echo "-------------------------------------"
echo "Install decktape:"
echo "  npm install -g decktape"
echo ""
echo "Then run:"
echo "  decktape reveal https://pitch.vibebrowser.app vibebrowser-pitch.pdf"
echo ""
echo "Method 3: Using Puppeteer (Programmatic)"
echo "-----------------------------------------"
echo "  npx puppeteer-pdf https://pitch.vibebrowser.app/?print-pdf vibebrowser-pitch.pdf"
echo ""

# Open the print-ready version in browser
if [[ "$1" == "--open" ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://pitch.vibebrowser.app/?print-pdf"
  elif command -v xdg-open > /dev/null; then
    xdg-open "https://pitch.vibebrowser.app/?print-pdf"
  else
    echo "Opening: https://pitch.vibebrowser.app/?print-pdf"
  fi
fi