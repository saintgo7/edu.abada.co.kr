@echo off
REM Markdown to DOCX Conversion Script for Windows
REM This script converts all Markdown files to DOCX format using Pandoc

echo ====================================
echo Markdown to DOCX Converter
echo ====================================
echo.

REM Check if pandoc is installed
where pandoc >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Pandoc is not installed.
    echo.
    echo Please install Pandoc first:
    echo   Windows: choco install pandoc
    echo   Or download from: https://pandoc.org/installing.html
    echo.
    pause
    exit /b 1
)

echo Pandoc found
echo.

REM Korean documents
echo Converting Korean documents...
FOR %%F IN (PRD TRD TDD) DO (
  if exist %%F.md (
    echo   -^> %%F.md -^> %%F.docx
    pandoc %%F.md -o %%F.docx --toc --toc-depth=3
  ) else (
    echo   Warning: %%F.md not found, skipping...
  )
)

echo.

REM English documents
echo Converting English documents...
FOR %%F IN (PRD_EN TRD_EN TDD_EN) DO (
  if exist %%F.md (
    echo   -^> %%F.md -^> %%F.docx
    pandoc %%F.md -o %%F.docx --toc --toc-depth=3
  ) else (
    echo   Warning: %%F.md not found, skipping...
  )
)

echo.
echo ====================================
echo All conversions completed!
echo ====================================
echo.
echo Generated files:
dir /b *.docx 2>nul
if %errorlevel% neq 0 (
    echo   (No .docx files found)
)
echo.
pause
