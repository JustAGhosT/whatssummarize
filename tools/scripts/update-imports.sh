#!/bin/bash

# Define the root directory
ROOT_DIR=$(pwd)

# Function to update imports in a file
update_imports() {
  local file=$1
  
  # Skip node_modules and other ignored directories
  if [[ $file == *"node_modules"* || $file == *".next"* || $file == *"dist"* || $file == *"build"* ]]; then
    return
  fi
  
  echo "Processing $file"
  
  # Update @/components/ to @ui/
  sed -i '' 's|@/components/|@ui/|g' "$file"
  
  # Update @/lib/ to @utils/
  sed -i '' 's|@/lib/|@utils/|g' "$file"
  
  # Update @/config/ to @config/
  sed -i '' 's|@/config/|@config/|g' "$file"
  
  echo "  - Updated imports in $file"
}

export -f update_imports

# Find and process all TypeScript and JavaScript files
find "$ROOT_DIR/apps/web/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec bash -c 'update_imports "$0"' {} \;
find "$ROOT_DIR/apps/api/src" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec bash -c 'update_imports "$0"' {} \;
find "$ROOT_DIR/packages" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec bash -c 'update_imports "$0"' {} \;

echo "✅ Import updates complete!"
