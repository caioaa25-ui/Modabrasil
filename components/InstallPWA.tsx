import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
    }

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Capture install prompt for Android/Desktop
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Fallback for when prompt isn't ready but not installed
      alert('Para instalar, toque no menu do navegador e selecione "Adicionar à Tela Inicial".');
    }
  };

  // Don't show if already installed as app
  if (isStandalone) return null;

  // Show button if we have the prompt OR if it's iOS
  if (!deferredPrompt && !isIOS) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-dark text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-900 transition shadow-lg animate-pulse"
      >
        <Download size={14} />
        Baixar App
      </button>

      {/* Modal de Instruções para iOS */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 relative">
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Instalar no iPhone</h3>
              <p className="text-sm text-gray-500">Siga os passos abaixo:</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Share size={24} className="text-blue-500" />
                <span className="text-sm font-medium">1. Toque no botão Compartilhar</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <PlusSquare size={24} className="text-gray-700" />
                <span className="text-sm font-medium">2. Selecione "Adicionar à Tela de Início"</span>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowIOSInstructions(false)}
                className="text-primary font-bold text-sm"
              >
                Entendi
              </button>
            </div>
            
            {/* Seta indicativa para baixo (simulando a posição do botão share no Safari) */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 sm:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
}