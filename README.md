# Legal Document AI Chat

An intelligent legal document analysis tool that uses AI to help users understand their legal documents, extract key information, and get answers to questions about contract terms and clauses.

## 🚀 Features

- **Document Upload & Management**: Support for PDF, Word (.doc, .docx), RTF, and text files
- **AI-Powered Analysis**: Leverages OpenAI GPT models for intelligent document understanding
- **Interactive Chat Interface**: Ask questions about your uploaded legal documents
- **Contract Analysis**: Automated risk assessment, key terms extraction, and obligation tracking
- **Secure Storage**: MongoDB-based document storage with proper access controls
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Context API for state management

### Backend
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose ODM
- OpenAI API integration
- Multer for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/legal-chat-ai.git
cd legal-chat-ai
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Set up environment variables**

Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/legal-ai

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here

# Optional: For enhanced PDF processing
# PINECONE_API_KEY=your_pinecone_api_key
# PINECONE_INDEX_NAME=legal-documents
# PINECONE_HOST_URL=your_pinecone_host_url
```

Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:3001
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
```bash
mongod
```

2. **Start the backend server**
```bash
cd backend
npm run dev
```

3. **Start the frontend development server**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Build

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Build the backend**
```bash
cd backend
npm run build
```

3. **Start the production server**
```bash
cd backend
npm run start:prod
```

## 📁 Project Structure

```
legal-chat-ai/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── uploads/            # Document upload directory
│   └── package.json
│
└── README.md               # This file
```

## 🔒 Security Considerations

- All uploaded documents are stored securely on the server
- API endpoints are protected with CORS
- Environment variables are used for sensitive configuration
- File uploads are validated and sanitized
- AI responses include disclaimers about legal advice

## 🧪 Testing

Run tests with:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 API Documentation

### Endpoints

#### Documents
- `POST /api/documents/upload` - Upload a new document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get specific document
- `DELETE /api/documents/:id` - Delete a document
- `GET /api/documents/:id/download` - Download a document

#### Chat
- `POST /api/chat` - Send a message and get AI response
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

#### Health Check
- `GET /api/health` - Check system status

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- AWS EC2
- AWS Elastic Beanstalk
- Docker containers
- Kubernetes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

This tool is for informational purposes only and does not constitute legal advice. Always consult with a qualified attorney for legal matters.

## 🙏 Acknowledgments

- OpenAI for GPT API
- MongoDB team for the database
- React team for the frontend framework
- All open-source contributors

## 📞 Support

For support, email support@yourdomain.com or open an issue in the GitHub repository.

---

Built with ❤️ by [Your Name]