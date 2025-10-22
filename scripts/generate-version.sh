#!/bin/bash

# Simple script to generate version info for console.log
cd "$(dirname "$0")/.."

# Get git information
COMMIT_HASH=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
SHORT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
COMMIT_DATE=$(git log -1 --format=%ci 2>/dev/null || echo "unknown")
COMMIT_MESSAGE=$(git log -1 --format=%s 2>/dev/null || echo "unknown")
BUILD_DATE=$(date -Iseconds)

# Check for uncommitted changes
if git status --porcelain 2>/dev/null | grep -q .; then
    DIRTY=" (dirty)"
else
    DIRTY=""
fi

# Create version info
VERSION_INFO="{
  \"commitHash\": \"$COMMIT_HASH\",
  \"shortHash\": \"$SHORT_HASH\",
  \"branch\": \"$BRANCH\",
  \"commitDate\": \"$COMMIT_DATE\",
  \"commitMessage\": \"$COMMIT_MESSAGE\",
  \"buildDate\": \"$BUILD_DATE\",
  \"version\": \"$SHORT_HASH$DIRTY\",
  \"license\": \"AGPLv3\"
}"

# Write to src/version.json
echo "$VERSION_INFO" > src/version.json

echo "Version info generated: $SHORT_HASH$DIRTY"

