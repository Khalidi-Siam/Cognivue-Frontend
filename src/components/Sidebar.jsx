import { useContext, useRef } from 'react';
import { ChatContext } from '../context/ChatContext';

const Sidebar = () => {
  const { uploadedDocs, removeDoc, newChat } = useContext(ChatContext);
  const fileInputRef = useRef(null);
  const { handleFileUpload } = useContext(ChatContext);

  const onFileChange = (e) => {
    handleFileUpload(e.target.files);
    e.target.value = '';
  };

  return (
    <aside className="w-[280px] bg-app-surface border-r border-app-border flex-col h-screen z-20 hidden md:flex shrink-0">
      {/* Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-app-border">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-7 h-7 bg-white text-black rounded-lg flex items-center justify-center text-sm shadow-md">
            <i className="fa-solid fa-layer-group"></i>
          </div>
          <span className="font-display font-semibold text-lg tracking-wide text-white">Cognivue</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button
          onClick={newChat}
          className="w-full flex items-center gap-2.5 bg-app-bg border border-app-border hover:border-app-muted/50 transition-colors text-app-text py-2.5 px-4 rounded-xl font-medium text-sm shadow-sm group"
        >
          <i className="fa-solid fa-pen-to-square text-app-muted group-hover:text-app-text transition-colors"></i>
          <span>New Session</span>
        </button>
      </div>

      {/* Knowledge Base */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
        <div className="flex items-center justify-between mt-2 mb-4 px-2">
          <span className="text-xs font-semibold text-app-muted tracking-wider uppercase">Sources</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            className="hidden" 
            accept=".pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-app-muted hover:text-app-text transition-colors tooltip relative group"
          >
            <i className="fa-solid fa-cloud-arrow-up"></i>
          </button>
        </div>
        <div className="px-2 mb-4">
          <p className="text-[10px] text-app-muted leading-tight">
            One PDF per upload. You can upload multiple PDFs in each session.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {uploadedDocs.length === 0 ? (
            <p className="text-xs text-app-muted text-center py-4">No documents indexed</p>
          ) : (
            uploadedDocs.map((doc) => (
              <div key={doc.id} className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-app-bg border border-transparent hover:border-app-border transition-all cursor-default">
                <div className="w-8 h-8 rounded-lg bg-app-surface border border-app-border flex items-center justify-center text-app-text shrink-0 mt-0.5">
                  <i className="fa-solid fa-file-lines text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-app-text truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-app-muted">{doc.size}</span>
                    <span className="w-1 h-1 rounded-full bg-app-border"></span>
                    <span className="text-[10px] text-app-muted">
                      {doc.status === 'indexed' ? 'Indexed' : 'Processing'}
                    </span>
                  </div>
                </div>
                <div 
                  title={doc.status === 'indexed' ? "once indexed you can't remove this" : "Remove document"}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                >
                  <button
                    onClick={() => doc.status !== 'indexed' && removeDoc(doc.id)}
                    disabled={doc.status === 'indexed'}
                    className={`p-1 ${
                      doc.status === 'indexed' 
                        ? 'text-app-muted/50 cursor-not-allowed' 
                        : 'text-app-muted hover:text-red-400'
                    }`}
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Profile / Footer */}
      <div className="p-4 border-t border-app-border">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-app-bg transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-app-accent to-purple-500 flex items-center justify-center text-xs font-medium text-white shadow-sm">
            WS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-app-text truncate">Workspace</p>
            <p className="text-xs text-app-muted truncate">Local Session</p>
          </div>
          <i className="fa-solid fa-gear text-app-muted text-sm"></i>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
