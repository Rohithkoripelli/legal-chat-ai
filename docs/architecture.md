# System Architecture

## Tech Stack
- Frontend: React 18 + TypeScript + Material-UI
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- AI: OpenAI GPT-4 API
- File Storage: Local (initially), AWS S3 (future)

## High-Level Flow
1. User uploads legal document
2. Backend extracts text and creates embeddings
3. User asks questions in chat
4. System finds relevant document sections
5. LLM generates contextual answers

## API Endpoints
- POST /api/documents/upload
- GET /api/documents
- POST /api/chat/message
- GET /api/chat/history/:sessionId