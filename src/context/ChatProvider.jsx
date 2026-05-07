import { useState, useEffect, useRef } from 'react';
import { ChatContext } from './ChatContext';
import { API_BASE_URL } from '../config/api';

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSources, setCurrentSources] = useState([]);

  const initialSessionId = sessionStorage.getItem('cognivue_session_id') || null;
  const sessionIdRef = useRef(initialSessionId);
  const [sessionId, setSessionId] = useState(initialSessionId);
  const initCalledRef = useRef(false);

  const saveSession = (id) => {
    sessionIdRef.current = id;
    setSessionId(id);
    if (id) {
      sessionStorage.setItem('cognivue_session_id', id);
    } else {
      sessionStorage.removeItem('cognivue_session_id');
    }
  };

  const initSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}session/start`, { method: 'POST' });
      const data = await response.json();
      if (data?.session_id) {
        saveSession(data.session_id);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}session/${id}/messages`);
      const data = await response.json();
      if (data?.messages) {
        setMessages(data.messages.map((msg, index) => ({
          id: index,
          role: msg.role === 'assistant' ? 'bot' : msg.role,
          content: msg.message,
          sources: null
        })));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const fetchDocuments = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}session/${id}/documents`);
      const data = await response.json();
      if (data?.documents) {
        setUploadedDocs(data.documents.map(doc => ({
          name: doc.filename,
          size: (doc.file_size / 1024 / 1024).toFixed(1) + ' MB',
          date: doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : new Date().toLocaleDateString(),
          id: doc.id,
          status: doc.status
        })));
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  useEffect(() => {
    if (initCalledRef.current) return;
    initCalledRef.current = true;

    if (sessionIdRef.current) {
      fetchMessages(sessionIdRef.current);
      fetchDocuments(sessionIdRef.current);
    } else {
      initSession();
    }
  }, []);

  const addMessage = (role, content, sources = null) => {
    setMessages(prev => [...prev, { id: Date.now() + Math.random(), role, content, sources }]);
  };

  const sendMessage = async (text) => {
    const currentId = sessionIdRef.current;
    if (!text.trim() || !currentId) return;

    addMessage('user', text);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}session/${currentId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text })
      });
      const data = await response.json();

      const sources = data.sources?.map(src => ({
        page: src.page,
        source_file: src.source_file,
        confidence: Math.round(src.cosine_similarity * 100)
      })) || [];

      addMessage('bot', data.answer, sources);
      setCurrentSources(sources);
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage('bot', 'Sorry, I encountered an error while processing your request.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (files) => {
    const currentId = sessionIdRef.current;
    if (!files.length || !currentId) return;

    if (files.length > 1) {
      alert("Please upload only one PDF at a time.");
    }

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE_URL}session/${currentId}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadedDocs(prev => [...prev, {
          name: data.filename,
          size: (data.file_size / 1024 / 1024).toFixed(1) + ' MB',
          date: new Date().toLocaleDateString(),
          id: data.document_id,
          status: data.status
        }]);
      } else {
        console.error('Failed to upload file:', file.name);
      }
    } catch (error) {
      console.error('Failed to upload file:', file.name, error);
    }
  };

  const removeDoc = (id) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
  };

  const newChat = async () => {
    const currentId = sessionIdRef.current;
    if (currentId) {
      try {
        await fetch(`${API_BASE_URL}session/${currentId}/end`, { method: 'POST' });
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    }

    setMessages([]);
    setCurrentSources([]);
    setUploadedDocs([]);
    saveSession(null);
    initCalledRef.current = false;
    initSession();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        uploadedDocs,
        isSidebarOpen,
        setIsSidebarOpen,
        isTyping,
        currentSources,
        sessionId,
        sendMessage,
        handleFileUpload,
        removeDoc,
        newChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
