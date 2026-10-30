#!/bin/bash

# Image Optimization Script for Photography Website
# Builds web/ copies from original/ images. Originals are never modified.
#
# Usage: ./optimize-images.sh [--force] [dir]
#   dir      limit to one folder under public/images (e.g. public/images/blog/those-eyes)
#   --force  regenerate web copies even if they are newer than the original

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sips is available (macOS built-in)
if ! command -v sips &> /dev/null; then
    echo -e "${YELLOW}⚠️  'sips' command not found. This script requires macOS.${NC}"
    exit 1
fi

# Configuration
GALLERY_MAX=2000      # Long edge for gallery web images
BLOG_MAX=1200         # Long edge for blog web images (rendered in a text column)
QUALITY=85            # JPEG quality (0-100, 85 is high quality)

FORCE=false
ROOT="public/images"
for arg in "$@"; do
    case "$arg" in
        --force) FORCE=true ;;
        *) ROOT="$arg" ;;
    esac
done

echo -e "${BLUE}📸 Building web images from originals in: $ROOT${NC}"
echo ""

created=0
skipped=0

while IFS= read -r original; do
    web="${original%/original/*}/web/${original##*/}"

    if [ "$FORCE" = false ] && [ -f "$web" ] && [ "$web" -nt "$original" ]; then
        skipped=$((skipped + 1))
        continue
    fi

    if [[ "$original" == */blog/* ]]; then
        max=$BLOG_MAX
    else
        max=$GALLERY_MAX
    fi

    mkdir -p "$(dirname "$web")"

    width=$(sips -g pixelWidth "$original" | awk '/pixelWidth:/ {print $2}')
    height=$(sips -g pixelHeight "$original" | awk '/pixelHeight:/ {print $2}')

    # Only shrink; never upscale small images (e.g. album covers)
    if [ "$width" -gt "$max" ] || [ "$height" -gt "$max" ]; then
        sips -Z "$max" -s format jpeg -s formatOptions "$QUALITY" "$original" --out "$web" > /dev/null
    else
        cp "$original" "$web"
    fi

    echo -e "${GREEN}  ✅ $web${NC}"
    created=$((created + 1))
done < <(find "$ROOT" -type f -path '*/original/*' -iname '*.jpg' | sort)

echo ""
echo -e "${GREEN}✨ Done: $created written, $skipped already up to date${NC}"
