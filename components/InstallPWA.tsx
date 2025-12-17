import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X, MoreVertical } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Detecta se JÁ está instalado (Standalone)
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      );
    };

    if (isInStandaloneMode()) {
      setIsStandalone(true);
    }

    // 2. Detecta iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // 3. Captura o evento do Chrome/Android para instalação nativa
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("Evento de instalação capturado!");
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // Ouve quando o app é instalado com sucesso para sumir com o botão
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowInstructions(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    // Cenário A: Temos o prompt nativo do Chrome/Android capturado
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      return;
    }

    // Cenário B: Não temos prompt (iOS ou Android bloqueou/já descartou). Mostramos instruções.
    setShowInstructions(true);
  };

  // Se já estiver rodando como APP, não mostra nada
  if (isStandalone) return null;

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-dark text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-blue-900 transition shadow-lg animate-pulse"
      >
        <Download size={14} />
        Baixar App
      </button>

      {/* Modal de Instruções (Genérico para iOS e Android Manual) */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 relative shadow-2xl">
            <button 
              onClick={() => setShowInstructions(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {isIOS ? 'Instalar no iPhone' : 'Instalar Aplicativo'}
              </h3>
              <p className="text-sm text-gray-500">
                Este app não ocupa memória e funciona offline.
              </p>
            </div>

            <div className="space-y-4">
              {isIOS ? (
                // Instruções iOS
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Share size={24} className="text-blue-500" />
                    <span className="text-sm font-medium">1. Toque no botão Compartilhar</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <PlusSquare size={24} className="text-gray-700" />
                    <span className="text-sm font-medium">2. Selecione "Adicionar à Tela de Início"</span>
                  </div>
                </>
              ) : (
                // Instruções Android / Chrome (Fallback Manual)
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MoreVertical size={24} className="text-gray-700" />
                    <span className="text-sm font-medium">1. Toque no menu do navegador (três pontos)</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Download size={24} className="text-gray-700" />
                    <span className="text-sm font-medium">2. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => setShowInstructions(false)}
                className="text-primary font-bold text-sm"
              >
                Entendi
              </button>
            </div>
            
            {/* Setinha indicativa (apenas visual help) */}
            {isIOS && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45 sm:hidden"></div>
            )}
            {!isIOS && (
               <div className="absolute top-[-8px] right-2 w-4 h-4 bg-white rotate-45 sm:hidden"></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}