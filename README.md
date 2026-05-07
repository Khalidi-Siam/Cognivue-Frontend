# Cognivue (Frontend)

Cognivue is a modern, responsive web interface built for the RAG-Chatbot system. It allows users to upload PDF documents, manage interaction sessions, and chat with an AI assistant that uses Retrieval-Augmented Generation to provide context-aware answers based on the uploaded files.

## Features

- **Document Upload**: Seamlessly upload PDF documents to build a session-specific knowledge base.
- **Real-time Chat**: Interact with the Gemini-powered AI to ask questions about your documents.
- **Session Management**: Persistent tracking of chat history and uploaded documents across page reloads.
- **Responsive Design**: Built with modern CSS utilities to look great on various screen sizes.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- The Cognivue Backend API running locally or accessible remotely.

### Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd "Cognivue"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (`d:\chat-bot frontend\Cognivue\.env`) and configure the backend API URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

### Running the Application

Start the Vite development server:
```bash
npm run dev
```
The application will typically be accessible at `http://localhost:5173`.
