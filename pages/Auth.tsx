import React, { useState } from 'react';

interface AuthProps {
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 fade-in">
      <div className="bg-white w-full max-w-md p-12 shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif italic mb-2">MODA BRASIL</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Nome Completo</label>
              <input 
                type="text" 
                className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition text-sm"
                placeholder="Ex: João Silva"
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">E-mail</label>
            <input 
              type="email" 
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition text-sm"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold mb-2">Senha</label>
            <input 
              type="password" 
              className="w-full border-b border-gray-300 py-3 outline-none focus:border-black transition text-sm"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition shadow-lg mt-8">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500 mb-4">
            {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-accent hover:border-accent transition"
          >
            {isLogin ? 'Criar Nova Conta' : 'Fazer Login'}
          </button>
        </div>

        <button 
          onClick={onBack}
          className="w-full mt-8 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-black transition"
        >
          Voltar para a loja
        </button>
      </div>
    </div>
  );
};