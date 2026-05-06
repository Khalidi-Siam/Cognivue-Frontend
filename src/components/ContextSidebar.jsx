import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';

const ContextSidebar = () => {
  const { currentSources } = useContext(ChatContext);

  return (
    <aside className="w-[320px] bg-app-bg border-l border-app-border hidden lg:flex flex-col h-screen shrink-0 relative">
      <div className="h-16 flex items-center px-6 border-b border-app-border">
        <h3 className="text-sm font-semibold text-app-text">Context References</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {currentSources.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <i className="fa-regular fa-compass text-3xl mb-3 text-app-muted"></i>
            <p className="text-xs text-app-muted font-medium px-8">
              Citations and extracted context will populate here during analysis.
            </p>
          </div>
        ) : (
          <div className="space-y-3 fade-in-up">
            {currentSources.map((s, index) => (
              <div key={index} className="bg-app-surface border border-app-border hover:border-app-muted/30 transition-colors rounded-xl p-3.5 cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <i className="fa-regular fa-file-pdf text-app-accent"></i>
                    <p className="text-sm font-medium text-white truncate">{s.source_file}</p>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                    {s.confidence}% Match
                  </span>
                </div>
                <p className="text-xs text-app-muted">Page {s.page} • Extracted Context</p>
                <div className="mt-2 h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                  <div className="h-full bg-app-accent rounded-full" style={{ width: `${s.confidence}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ContextSidebar;
