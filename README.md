# Vibe Browser Pitch Decks

This repository contains the source code and generated PDFs for Vibe Browser pitch decks.

## Available Versions

### Latest (v1.2)
- **View/Download**: [pitch.pdf](./pitch.pdf)
- **Status**: Current (March 2026)
- **Focus**: Traction, Market Beachhead (Legal/Tax), Local-First Architecture

### Historical Versions

#### v1.1 (March 2026)
- **View/Download**: [pitch-v1.1.pdf](./pitch-v1.1.pdf)
- **Status**: Superseded
- **Note**: Original pre-seed deck

## Generation

To regenerate the PDF from `index.html`:

```bash
npm install
node generate-pdf.js
```

This script uses Puppeteer to capture slides and embeds images as base64 to ensure correct rendering in the final PDF.
