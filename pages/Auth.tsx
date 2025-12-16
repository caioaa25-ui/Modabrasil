import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '../services/db';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Truck, ChevronRight, ArrowLeft, ShieldAlert } from 'lucide-react';

type UserRole = 'customer' | 'seller' | 'driver' | 'admin';

export default function Auth() {
  // Estados de navegação e dados
  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  
  // Segredo Admin
  const [secretCount, setSecretCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);

  // Estados do formulário
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSecretTap = () => {
    const newCount = secretCount + 1;
    setSecretCount(newCount);
    if (newCount === 5) {
      setShowAdmin(true);
      alert('🔒 Modo Administrador Desbloqueado!');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'driver') {
      alert('Cadastro de entregadores em breve!');
      return;
    }
    setSelectedRole(role);
    setStep('form');
    // Se for lojista ou admin, ajusta o estado de login
    if (role === 'seller' || role === 'admin') setIsLogin(true); // Default to login for sellers/admins
    else setIsLogin(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile({ 
          uid: cred.user.uid, 
          email, 
          name, 
          role: selectedRole === 'driver' ? 'customer' : selectedRole 
        });
      }
      
      // Redirect based on role
      if (selectedRole === 'seller') navigate('/seller');
      else if (selectedRole === 'admin') navigate('/admin');
      else navigate('/');

    } catch (err: any) {
      let msg = "Ocorreu um erro.";
      if (err.code === 'auth/invalid-credential') msg = "E-mail ou senha incorretos.";
      if (err.code === 'auth/email-already-in-use') msg = "Este e-mail já está em uso.";
      if (err.code === 'auth/weak-password') msg = "A senha deve ter pelo menos 6 caracteres.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- TELA 1: SELEÇÃO DE PERFIL ---
  if (step === 'selection') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center pt-10 px-4">
        {/* Logo Central */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-dark">
            Moda<span className="text-primary">Brasil</span>
          </h1>
        </div>

        {/* Título com Gatilho Secreto */}
        <div onClick={handleSecretTap} className="cursor-pointer select-none">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">
            Como você deseja acessar?
          </h2>
        </div>
        <p className="text-gray-500 mb-8 text-center text-sm">
          Escolha seu perfil para continuar.
        </p>

        <div className="w-full max-w-md space-y-4">
          {/* Card Cliente */}
          <button 
            onClick={() => handleRoleSelect('customer')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <ShoppingBag size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Cliente</h3>
                <p className="text-sm text-gray-500">Fazer compras</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          {/* Card Lojista */}
          <button 
            onClick={() => handleRoleSelect('seller')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <Store size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Lojista</h3>
                <p className="text-sm text-gray-500">Gerenciar loja</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
          </button>

          {/* Card Entregador */}
          <button 
            onClick={() => handleRoleSelect('driver')}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group opacity-80"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                <Truck size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900">Entregador</h3>
                <p className="text-sm text-gray-500">Fazer entregas (Em breve)</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300" />
          </button>

          {/* Card Admin (Secreto) */}
          {showAdmin && (
            <button 
              onClick={() => handleRoleSelect('admin')}
              className="w-full bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 flex items-center justify-between hover:bg-gray-900 transition-all animate-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-900 flex items-center justify-center text-white">
                  <ShieldAlert size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Administrador</h3>
                  <p className="text-sm text-gray-400">Gerenciar Sistema</p>
                </div>
              </div>
              <ChevronRight className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // --- TELA 2: FORMULÁRIO ---
  return (
    <div className="min-h-[80vh] flex flex-col items-center pt-6 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md relative">
        <button 
          onClick={() => setStep('selection')} 
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-6">
          <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${
            selectedRole === 'customer' ? 'bg-red-50 text-red-500' : 
            selectedRole === 'seller' ? 'bg-blue-50 text-blue-600' : 'bg-gray-800 text-white'
          }`}>
            {selectedRole === 'customer' ? <ShoppingBag size={24} /> : 
             selectedRole === 'seller' ? <Store size={24} /> : <ShieldAlert size={24} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p className="text-sm text-gray-500">
            Acesso: <span className="font-bold uppercase">{selectedRole}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">NOME COMPLETO</label>
              <input 
                type="text" 
                placeholder="Ex: João Silva" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
                required 
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">E-MAIL</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">SENHA</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition" 
              required 
            />
          </div>
          
          <button 
            disabled={loading} 
            className={`w-full text-white font-bold py-3 rounded-lg hover:brightness-90 transition shadow-sm mt-4 ${
              selectedRole === 'customer' ? 'bg-primary' : 
              selectedRole === 'admin' ? 'bg-red-700' : 'bg-dark'
            }`}
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm mb-2">
            {isLogin ? 'Ainda não tem cadastro?' : 'Já possui uma conta?'}
          </p>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Criar conta gratuitamente' : 'Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
}