import { useContext, useState, useRef, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';

const MainArea = () => {
  const { messages, isTyping, sendMessage, uploadedDocs, handleFileUpload } = useContext(ChatContext);
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputText);
    setInputText('');
  };

  const onFileChange = (e) => {
    handleFileUpload(e.target.files);
    e.target.value = '';
  };

  const setInputValue = (val) => {
    setInputText(val);
    document.getElementById('user-input')?.focus();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <main className="flex-1 flex flex-col h-screen relative bg-app-bg bg-mesh">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-app-border/50 backdrop-blur-md bg-app-bg/80 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-app-muted hover:text-app-text">
            <i className="fa-solid fa-bars text-lg"></i>
          </button>
          <div className="flex items-center gap-2 bg-app-surface px-3 py-1.5 rounded-full border border-app-border">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-xs font-medium text-app-muted">Analysis Engine Online</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-app-muted px-3 py-1.5 bg-app-surface border border-app-border rounded-full flex items-center gap-2">
            <i className="fa-regular fa-file-lines"></i>
            <span>{uploadedDocs.length} Indexed</span>
          </div>
        </div>
      </header>

      {/* Chat Scroll Area */}
      <div className="flex-1 overflow-y-auto w-full pb-36 pt-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto px-6 pt-16 pb-8 flex flex-col items-center text-center fade-in-up">
            <div className="w-16 h-16 mb-6 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-microchip text-2xl text-app-text"></i>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold mb-4 tracking-tight text-white">
              What are we investigating?
            </h1>
            <p className="text-app-muted text-lg max-w-lg leading-relaxed">
              Upload your research papers, contracts, or documentation. Cognivue will extract insights and cite precise sources.
            </p>
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              <div
                onClick={() => setInputValue('Summarize the key findings in the latest document')}
                className="p-4 rounded-xl border border-app-border bg-app-surface/50 hover:bg-app-surface transition-colors cursor-pointer group"
              >
                <i className="fa-solid fa-wand-magic-sparkles text-app-accent mb-2"></i>
                <h3 className="text-sm font-medium text-white mb-1">Summarize findings</h3>
                <p className="text-xs text-app-muted">Extract the core arguments from the uploaded text.</p>
              </div>
              <div
                onClick={() => setInputValue('Find all entities and dates mentioned')}
                className="p-4 rounded-xl border border-app-border bg-app-surface/50 hover:bg-app-surface transition-colors cursor-pointer group"
              >
                <i className="fa-solid fa-magnifying-glass-chart text-app-accent mb-2"></i>
                <h3 className="text-sm font-medium text-white mb-1">Extract entities</h3>
                <p className="text-xs text-app-muted">Locate specific names, dates, and organizations.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 space-y-8">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex w-full fade-in-up ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] sm:max-w-[75%]">
                    <div className="bg-app-surface border border-app-border text-app-text px-5 py-3.5 rounded-2xl rounded-tr-sm text-[15px] leading-relaxed shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[95%] sm:max-w-[85%] flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <i className="fa-solid fa-layer-group text-xs"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-app-text text-[15px] leading-loose pt-1">
                        {msg.content}
                      </div>
                      {msg.sources && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {msg.sources.map((s, idx) => (
                            <div key={idx} className="inline-flex items-center gap-2 bg-app-highlight border border-app-accent/20 px-3 py-1.5 rounded-lg text-xs cursor-pointer hover:bg-app-accent hover:text-white hover:border-app-accent transition-all group">
                              <i className="fa-regular fa-file-pdf text-app-accent group-hover:text-white"></i>
                              <span className="font-medium text-app-text group-hover:text-white truncate max-w-[150px]">{s.source_file}</span>
                              <span className="text-app-muted group-hover:text-white/80 opacity-60">p.{s.page}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex w-full justify-start gap-4 fade-in-up">
                <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <i className="fa-solid fa-layer-group text-xs"></i>
                </div>
                <div className="flex items-center gap-1.5 h-10 px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-app-muted dot-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-app-muted dot-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-app-muted dot-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-app-bg via-app-bg to-transparent">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={onSubmit} className="relative group">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
            
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full flex items-center justify-center text-app-muted hover:text-white hover:bg-app-border transition-all"
              >
                <i className="fa-solid fa-paperclip text-lg"></i>
              </button>
            </div>

            <input
              id="user-input"
              type="text"
              autoComplete="off"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question about your context..."
              className="w-full bg-app-surface border border-app-border hover:border-app-border/80 focus:border-app-accent focus:ring-1 focus:ring-app-accent focus:outline-none rounded-2xl py-4 pl-14 pr-16 text-base text-app-text placeholder-app-muted/60 shadow-float transition-all z-20"
            />
            
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default MainArea;
