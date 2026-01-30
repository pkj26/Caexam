import React, { useState } from 'react';
import { X, FileText, Download, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewerKey, setViewerKey] = useState(0); // To force reload iframe

  // Google Docs Viewer is lightweight and works everywhere
  const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  const handleDirectDownload = async () => {
    setIsDownloading(true);
    try {
      // Method 1: Fetch blob (Best for forcing download name)
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = title ? `${title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Method 2: Fallback to direct link
      // If fetch fails (CORS), we use a temporary anchor tag.
      // We try target="_blank" as a fail-safe to ensures we don't crash the app if it navigates.
      
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; 
      link.download = title || 'download.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full h-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center gap-3 overflow-hidden flex-1">
             <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-500 shrink-0">
               <FileText size={18} />
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-brand-dark truncate text-sm md:text-base">{title}</h3>
               <p className="text-[10px] text-slate-400 font-mono truncate hidden sm:block">
                 Secure Viewer • Read Only
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setViewerKey(prev => prev + 1)}
              className="p-2 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-xl transition-colors"
              title="Reload Viewer"
            >
              <RefreshCw size={18} />
            </button>

            <button 
              onClick={handleDirectDownload}
              disabled={isDownloading}
              className="px-4 py-2 bg-brand-primary text-white hover:bg-brand-blue rounded-xl transition-colors text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
              <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>
            
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area - Using Google Docs Viewer */}
        <div className="flex-1 relative bg-slate-50 overflow-hidden">
          
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-dark/50 z-0">
              <Loader2 size={40} className="animate-spin text-brand-primary mb-4" />
              <p className="text-sm font-bold">Loading Document...</p>
            </div>
          )}

          <iframe
            key={viewerKey}
            src={googleDocsUrl}
            className="w-full h-full relative z-10"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
            title="PDF Viewer"
          />

          {/* Fallback Message (Behind iframe, visible if iframe fails completely) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-0 text-center w-full px-4">
             <p className="text-[10px] text-slate-400 mb-2">If the document doesn't load, use the button below</p>
             <a 
               href={url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
             >
               Open External Link <ExternalLink size={10} />
             </a>
          </div>

        </div>
      </div>
    </div>
  );
};