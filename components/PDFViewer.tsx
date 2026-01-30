import React, { useState, useEffect } from 'react';
import { X, FileText, Download, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
// Added missing Button import
import { Button } from './Button';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ url, title, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to force direct download
  const forceDownload = async (fileUrl: string, fileName: string) => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback: If CORS blocks fetch, try opening in hidden iframe
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', fileName);
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    // Attempt to fetch blob for faster native viewing and direct access
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load PDF directly");
        const blob = await response.blob();
        const localUrl = window.URL.createObjectURL(blob);
        setBlobUrl(localUrl);
      } catch (err) {
        console.warn("Direct blob load failed, falling back to viewer:", err);
        // If fetch fails (usually CORS), we'll use the original URL with Google Viewer
        setBlobUrl(null);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (blobUrl) window.URL.revokeObjectURL(blobUrl);
    };
  }, [url]);

  // If blob is available, use it for faster native viewing. 
  // Otherwise, use Google Docs as a reliable fallback.
  const finalIframeSrc = blobUrl 
    ? blobUrl 
    : `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6">
      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full h-full max-w-6xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-slide-in border border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
               <FileText size={20} />
             </div>
             <div className="overflow-hidden">
               <h3 className="font-bold text-brand-dark truncate text-sm md:text-base leading-tight">{title}</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
                 {blobUrl ? 'Native Optimized View' : 'Cloud Secure Viewer'}
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => forceDownload(url, title)}
              disabled={isDownloading}
              className="h-10 px-4 bg-brand-primary text-white hover:bg-brand-blue rounded-xl transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
              <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Click to Download'}</span>
            </button>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-slate-100">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-dark/50 z-20 bg-slate-50">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-brand-primary/20 rounded-full"></div>
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <p className="text-xs font-black uppercase tracking-widest mt-4">Preparing Preview...</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle size={48} className="text-red-400 mb-4" />
              <h4 className="text-lg font-bold text-brand-dark">Preview Failed</h4>
              <p className="text-sm text-slate-500 mb-6">We couldn't load the preview, but you can still download the file.</p>
              <Button onClick={() => forceDownload(url, title)}>Download Now</Button>
            </div>
          ) : (
            <iframe
              src={finalIframeSrc}
              className="w-full h-full border-none relative z-10"
              onLoad={() => setLoading(false)}
              title="PDF Viewer"
            />
          )}

          {/* Speed Tip */}
          {!loading && !blobUrl && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-brand-dark/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-2xl">
              <p className="text-[10px] font-bold text-white flex items-center gap-2 whitespace-nowrap">
                <RefreshCw size={10} className="text-brand-orange animate-spin" /> 
                Preview slow? Click 'Download' for instant offline access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};