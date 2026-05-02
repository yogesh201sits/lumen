# PerpWeb

<img src="./frontend/public/logo.png" alt="Logo" width="150">

A Perplexity-style AI assistant web application with real-time search capabilities.

## Features

- **AI-Powered Responses**: Uses Groq's Llama model for intelligent answers
- **Web Search Integration**: Leverages Seltz API for comprehensive search results
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Real-time Chat**: Interactive conversation interface
- **Source Citations**: Provides URLs for referenced information

## Architecture

### Backend
- **Node.js/Express**: RESTful API server
- **LLM Integration**: ChatGroq with structured output parsing
- **Search Service**: Seltz API for web search
- **Utilities**: Document parsing and logging modules

### Frontend
- **React + TypeScript**: Modern web application
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Component Library**: Custom UI components with shadcn/ui

## Setup

### Prerequisites
- Node.js (v18+)
- npm or bun
- API keys for Groq and Seltz

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd perpWeb
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create environment file:
```bash
# In backend/.env
GROQ_API_KEY=your_groq_api_key
SELTZ_API_KEY=your_seltz_api_key
```

5. Start the backend:
```bash
cd backend
npm start
```

6. Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

- `POST /conversation` - Process user queries
- `GET /health` - Health check endpoint

## Technologies Used

- **Backend**: Node.js, Express, LangChain, Zod
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **APIs**: Groq AI, Seltz Search
- **Deployment**: Ready for containerization
