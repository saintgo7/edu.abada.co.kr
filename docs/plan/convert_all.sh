#!/bin/bash

# Markdown to DOCX Conversion Script
# This script converts all Markdown files to DOCX format using Pandoc

echo "===================================="
echo "Markdown to DOCX Converter"
echo "===================================="
echo ""

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null
then
    echo "❌ Error: Pandoc is not installed."
    echo ""
    echo "Please install Pandoc first:"
    echo "  macOS:   brew install pandoc"
    echo "  Ubuntu:  sudo apt-get install pandoc"
    echo "  Windows: choco install pandoc"
    echo ""
    exit 1
fi

echo "✓ Pandoc found: $(pandoc --version | head -n 1)"
echo ""

# Korean documents
echo "Converting Korean documents..."
for file in PRD TRD TDD; do
  if [ -f "${file}.md" ]; then
    echo "  → ${file}.md → ${file}.docx"
    pandoc ${file}.md -o ${file}.docx \
      --toc \
      --toc-depth=3 \
      --metadata title="${file} - 제품 요구사항 정의서" \
      --metadata date="$(date +%Y-%m-%d)"
  else
    echo "  ⚠ ${file}.md not found, skipping..."
  fi
done

echo ""

# English documents
echo "Converting English documents..."
for file in PRD_EN TRD_EN TDD_EN; do
  if [ -f "${file}.md" ]; then
    echo "  → ${file}.md → ${file}.docx"
    pandoc ${file}.md -o ${file}.docx \
      --toc \
      --toc-depth=3 \
      --metadata date="$(date +%Y-%m-%d)"
  else
    echo "  ⚠ ${file}.md not found, skipping..."
  fi
done

echo ""
echo "===================================="
echo "✓ All conversions completed!"
echo "===================================="
echo ""
echo "Generated files:"
ls -lh *.docx 2>/dev/null || echo "  (No .docx files found)"
echo ""
