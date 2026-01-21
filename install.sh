#!/bin/bash

echo "========================================"
echo "  Vibe Grade - 설치 스크립트"
echo "========================================"
echo ""

# Node.js 확인
if ! command -v node &> /dev/null; then
    echo "[!] Node.js가 설치되어 있지 않습니다."
    echo ""
    echo "다음 명령어로 설치하세요:"
    echo ""
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "  source ~/.bashrc"
    echo "  nvm install --lts"
    echo ""
    exit 1
fi

NODE_VERSION=$(node -v)
echo "[OK] Node.js 버전: $NODE_VERSION"

# npm 확인
if ! command -v npm &> /dev/null; then
    echo "[!] npm이 설치되어 있지 않습니다."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "[OK] npm 버전: $NPM_VERSION"
echo ""

# 의존성 설치
echo "[..] 의존성 설치 중..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  설치 완료!"
    echo "========================================"
    echo ""
    echo "실행 명령어:"
    echo "  npm run dev"
    echo ""
    echo "브라우저에서 http://localhost:3000 접속"
    echo ""
else
    echo ""
    echo "[!] 설치 중 오류가 발생했습니다."
    exit 1
fi
