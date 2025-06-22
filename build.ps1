# Ethereum Token Tracker Build Script
# This script helps with development and building the Tauri application

param(
    [switch]$Dev,
    [switch]$Build,
    [switch]$Clean,
    [switch]$Help
)

if ($Help) {
    Write-Host "Ethereum Token Tracker Build Script"
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\build.ps1 -Dev     # Run in development mode"
    Write-Host "  .\build.ps1 -Build   # Build for production"
    Write-Host "  .\build.ps1 -Clean   # Clean build artifacts"
    Write-Host "  .\build.ps1 -Help    # Show this help"
    Write-Host ""
    Write-Host "Prerequisites:"
    Write-Host "  - Rust (latest stable)"
    Write-Host "  - Node.js (for Tauri CLI)"
    Write-Host "  - .env file with ETHEREUM_RPC_URL"
    exit 0
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Please create a .env file with your Ethereum RPC URL:" -ForegroundColor Yellow
    Write-Host "ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID" -ForegroundColor Cyan
    Write-Host ""
}

if ($Clean) {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Green
    cargo clean
    if (Test-Path "src-tauri/target") {
        Remove-Item -Recurse -Force "src-tauri/target"
    }
    Write-Host "Clean complete!" -ForegroundColor Green
    exit 0
}

if ($Dev) {
    Write-Host "Starting development mode..." -ForegroundColor Green
    Write-Host "Make sure you have set up your .env file with ETHEREUM_RPC_URL" -ForegroundColor Yellow
    cargo tauri dev
    exit 0
}

if ($Build) {
    Write-Host "Building for production..." -ForegroundColor Green
    Write-Host "Make sure you have set up your .env file with ETHEREUM_RPC_URL" -ForegroundColor Yellow
    cargo tauri build
    Write-Host "Build complete! Check src-tauri/target/release/ for the executable." -ForegroundColor Green
    exit 0
}

# Default: show help
Write-Host "Ethereum Token Tracker Build Script" -ForegroundColor Cyan
Write-Host "Use -Help for usage information" -ForegroundColor Yellow 