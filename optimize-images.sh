#!/bin/bash

# Image Optimization Script for Photography Website
# Compresses and resizes images to web-friendly sizes while maintaining quality

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📸 Image Optimization Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if sips is available (macOS built-in)
if ! command -v sips &> /dev/null; then
    echo -e "${YELLOW}⚠️  'sips' command not found. This script requires macOS.${NC}"
    exit 1
fi

# Configuration
IMAGE_DIR="public/images"
MAX_WIDTH=2000        # Max width for landscape images
MAX_HEIGHT=2000       # Max height for portrait images
QUALITY=85            # JPEG quality (0-100, 85 is high quality)

# Create backup directory
BACKUP_DIR="public/images_original_backup"
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${YELLOW}📦 Creating backup of original images...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp -R "$IMAGE_DIR"/* "$BACKUP_DIR/"
    echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"
    echo ""
fi

# Function to optimize a single image
optimize_image() {
    local file="$1"
    local original_size=$(stat -f%z "$file")

    # Get current dimensions
    local width=$(sips -g pixelWidth "$file" | awk '/pixelWidth:/ {print $2}')
    local height=$(sips -g pixelHeight "$file" | awk '/pixelHeight:/ {print $2}')

    # Only resize if larger than max dimensions
    if [ "$width" -gt "$MAX_WIDTH" ] || [ "$height" -gt "$MAX_HEIGHT" ]; then
        echo -e "${BLUE}  Resizing from ${width}x${height}...${NC}"
        sips -Z "$MAX_WIDTH" "$file" --out "$file" > /dev/null 2>&1
    fi

    # Compress JPEG with quality setting
    if [[ "$file" == *.jpg ]] || [[ "$file" == *.JPG ]] || [[ "$file" == *.jpeg ]]; then
        sips -s format jpeg -s formatOptions "$QUALITY" "$file" --out "$file" > /dev/null 2>&1
    fi

    local new_size=$(stat -f%z "$file")
    local saved=$((original_size - new_size))
    local percent=$((100 * saved / original_size))

    echo -e "${GREEN}  ✅ Saved: $(numfmt --to=iec $saved) (${percent}% reduction)${NC}"
}

# Export function for use in find
export -f optimize_image
export MAX_WIDTH MAX_HEIGHT QUALITY BLUE GREEN NC

# Process all images
echo -e "${BLUE}🔄 Optimizing images in: $IMAGE_DIR${NC}"
echo ""

# Count total images
total_images=$(find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" \) | wc -l | tr -d ' ')
echo -e "${BLUE}Found $total_images images to optimize${NC}"
echo ""

# Track progress
current=0

# Find and optimize all JPG images
find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.JPG" \) | while read file; do
    current=$((current + 1))
    echo -e "${YELLOW}[$current/$total_images] Processing: $(basename "$file")${NC}"
    optimize_image "$file"
    echo ""
done

# Calculate total savings
original_size=$(du -sk "$BACKUP_DIR" | cut -f1)
new_size=$(du -sk "$IMAGE_DIR" | cut -f1)
saved=$((original_size - new_size))
percent=$((100 * saved / original_size))

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✨ Optimization Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "Original size: $(numfmt --to=iec $((original_size * 1024)))"
echo -e "New size:      $(numfmt --to=iec $((new_size * 1024)))"
echo -e "Total saved:   $(numfmt --to=iec $((saved * 1024))) (${percent}% reduction)"
echo ""
echo -e "${BLUE}💡 Original images backed up to: $BACKUP_DIR${NC}"
echo ""
