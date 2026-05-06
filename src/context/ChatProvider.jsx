import { useState, useEffect } from 'react';
import { ChatContext } from './ChatContext';

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentSources, setCurrentSources] = useState([]);

  // Demo response for prototyping
  const demoResponse = {
    answer: "Based on the provided documentation, the system architecture relies on a multi-stage retrieval process. Initially, semantic search isolates relevant text chunks. Subsequently, a cross-encoder model reranks these chunks to ensure maximum contextual relevance before generation.",
    sources: [
      { page: 12, source_file: "system_architecture_v2.pdf", confidence: 94 },
      { page: 4, source_file: "retrieval_methodology.pdf", confidence: 88 }
    ]
  };

  const addMessage = (role, content, sources = null) => {
    setMessages(prev => [...prev, { id: Date.now(), role, content, sources }]);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    addMessage('user', text);
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      setIsTyping(false);
      addMessage('bot', demoResponse.answer, demoResponse.sources);
      setCurrentSources(demoResponse.sources);
    }, 1000);
  };

  const handleFileUpload = (files) => {
    if (!files.length) return;

    const newDocs = Array.from(files).map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      date: new Date().toLocaleDateString(),
      id: Date.now() + Math.random()
    }));

    // Simulate indexing delay
    setTimeout(() => {
      setUploadedDocs(prev => [...prev, ...newDocs]);
    }, 1200);
  };

  const removeDoc = (id) => {
    setUploadedDocs(prev => prev.filter(doc => doc.id !== id));
  };

  const newChat = () => {
    setMessages([]);
    setCurrentSources([]);
  };

  // Demo data initialization
  useEffect(() => {
    setTimeout(() => {
      setUploadedDocs([
        { id: '1', name: "system_architecture_v2.pdf", size: "3.2 MB" },
        { id: '2', name: "retrieval_methodology.pdf", size: "1.1 MB" }
      ]);
    }, 500);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        uploadedDocs,
        isSidebarOpen,
        setIsSidebarOpen,
        isTyping,
        currentSources,
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
