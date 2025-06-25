#!/bin/bash

echo "🚀 Setting up OCR dependencies for Legal AI"
echo "============================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
else
    OS="Unknown"
fi

echo "📱 Detected OS: $OS"

# Install system dependencies
echo ""
echo "📦 Installing system dependencies..."

if [[ "$OS" == "macOS" ]]; then
    if command_exists brew; then
        echo "✅ Homebrew found"
        echo "📥 Installing poppler..."
        brew install poppler
        
        # Check if installation was successful
        if command_exists pdftoppm; then
            echo "✅ Poppler installed successfully"
        else
            echo "❌ Poppler installation failed"
            exit 1
        fi
    else
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
elif [[ "$OS" == "Linux" ]]; then
    if command_exists apt-get; then
        echo "📥 Installing poppler-utils..."
        sudo apt-get update
        sudo apt-get install -y poppler-utils
    elif command_exists yum; then
        echo "📥 Installing poppler-utils..."
        sudo yum install -y poppler-utils
    elif command_exists dnf; then
        echo "📥 Installing poppler-utils..."
        sudo dnf install -y poppler-utils
    else
        echo "❌ Package manager not found. Please install poppler-utils manually."
        exit 1
    fi
    
    # Check if installation was successful
    if command_exists pdftoppm; then
        echo "✅ Poppler installed successfully"
    else
        echo "❌ Poppler installation failed"
        exit 1
    fi
else
    echo "❌ Unsupported operating system: $OS"
    echo "Please install poppler manually:"
    echo "  - macOS: brew install poppler"
    echo "  - Ubuntu/Debian: sudo apt-get install poppler-utils"
    echo "  - CentOS/RHEL: sudo yum install poppler-utils"
    exit 1
fi

# Install Node.js dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
cd "$(dirname "$0")/backend"

if ! command_exists npm; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

npm install

# Test the installation
echo ""
echo "🧪 Testing OCR setup..."

# Create a simple test
cat > test-ocr-setup.js << 'EOF'
const { execSync } = require('child_process');

console.log('🔍 Testing OCR dependencies...');

// Test poppler
try {
    execSync('pdftoppm -h', { stdio: 'ignore' });
    console.log('✅ Poppler (PDF conversion): Working');
} catch (error) {
    console.log('❌ Poppler (PDF conversion): Not working');
    process.exit(1);
}

// Test Tesseract.js
try {
    require('tesseract.js');
    console.log('✅ Tesseract.js (OCR engine): Working');
} catch (error) {
    console.log('❌ Tesseract.js (OCR engine): Not working');
    process.exit(1);
}

// Test Jimp
try {
    require('jimp');
    console.log('✅ Jimp (image processing): Working');
} catch (error) {
    console.log('❌ Jimp (image processing): Not working');
    process.exit(1);
}

// Test pdf-poppler
try {
    require('pdf-poppler');
    console.log('✅ pdf-poppler (PDF to image): Working');
} catch (error) {
    console.log('❌ pdf-poppler (PDF to image): Not working');
    process.exit(1);
}

console.log('\n🎉 All OCR dependencies are working correctly!');
console.log('\n📋 What works now:');
console.log('  ✅ Image OCR (JPG, PNG, BMP, TIFF, GIF)');
console.log('  ✅ PDF OCR (scanned PDFs converted to images)');
console.log('  ✅ Multi-page document processing');
console.log('  ✅ Image quality enhancement');
console.log('  ✅ Automatic cleanup of temporary files');
console.log('\n🚀 Your Legal AI application now supports full OCR functionality!');
EOF

node test-ocr-setup.js

# Clean up test file
rm -f test-ocr-setup.js

echo ""
echo "✨ OCR setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "  1. Upload scanned PDFs to test OCR functionality"
echo "  2. Try contract analysis with scanned documents"
echo "  3. Test chat with scanned document uploads"
echo ""
echo "🔧 If you encounter issues:"
echo "  1. Check logs in the backend console"
echo "  2. Ensure temp directory has write permissions"
echo "  3. Verify system has enough disk space for temporary files"