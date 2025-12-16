import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '../services/db';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { ShoppingBag, ChevronRight, ArrowLeft, Loader2, Eye, EyeOff, X, Users } from 'lucide-react';

export default function Auth() {
  // Default view is 'role_select'
  const [view, setView] = useState<'login' | 'role_select'>('role_select');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  
  // Login/Register Toggle inside the form
  const [isRegistering, setIsRegistering] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setView('login');
    setError('');
  };

  const getErrorMessage = (code: string) => {
    switch(code) {
      case 'auth/invalid-email': return 'Confira o seu e-mail.';
      case 'auth/user-disabled': return 'Usuário desativado.';
      case 'auth/user-not-found': return 'Não encontramos este e-mail.';
      case 'auth/wrong-password': return 'Senha incorreta.';
      case 'auth/email-already-in-use': return 'E-mail já cadastrado.';
      case 'auth/weak-password': return 'Senha muito fraca.';
      case 'auth/invalid-credential': return 'Dados incorretos.';
      default: return 'Verifique seus dados.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCred;
      if (isRegistering) {
        // REGISTER
        userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await createUserProfile({
          uid: userCred.user.uid,
          name,
          email: email.trim(),
          role: selectedRole,
          approved: true,
          balance: 0,
          createdAt: Date.now()
        });
      } else {
        // LOGIN
        userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      
      // Navigate based on role
      if (selectedRole === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }

    } catch (err: any) {
      setError(getErrorMessage(err.code || ''));
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    if (selectedRole === 'customer') return 'Cliente';
    if (selectedRole === 'seller') return 'Parceiro';
    return '';
  };

  // --- VIEW 1: ROLE SELECTION ---
  if (view === 'role_select') {
    return (
      <div className="min-h-screen bg-white p-6 flex flex-col">
        {/* Top Right Close Button */}
        <div className="flex justify-end">
          <Link to="/" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={24} />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <span className="font-extrabold text-3xl tracking-tight text-dark">
              Moda<span className="text-primary">Brasil</span>
            </span>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Como você deseja acessar?
            </h1>
            <p className="text-gray-500">
              Escolha seu perfil para continuar.
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer Option */}
            <button 
              onClick={() => handleRoleSelect('customer')}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm hover:shadow-md hover:border-primary transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Cliente</h3>
                <p className="text-sm text-gray-500">Fazer compras</p>
              </div>
              <ChevronRight className="text-gray-300" />
            </button>

            {/* Partner/Seller Option */}
            <button 
              onClick={() => handleRoleSelect('seller')}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm hover:shadow-md hover:border-primary transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">Parceiro</h3>
                <p className="text-sm text-gray-500">Divulgar e lucrar</p>
              </div>
              <ChevronRight className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: AUTH FORM (Login/Register) ---
  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      {/* Header */}
      <div className="h-[60px] flex items-center px-4 shadow-sm relative mb-6 bg-white text-gray-800">
        <button onClick={() => setView('role_select')} className="absolute left-4 p-1 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <div className="w-full flex justify-center pointer-events-none items-center gap-2">
           <span className="font-bold">
              Acesso {getRoleTitle()}
           </span>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-gray-900">
            {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-sm mt-1 text-gray-500">
            {isRegistering ? 'Preencha os dados abaixo' : 'Digite seus dados para entrar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 rounded-2xl shadow-lg border bg-white border-gray-100">
           {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded text-sm flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

          <div className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-xs font-bold mb-1 ml-1 text-gray-700">NOME COMPLETO</label>
                <input
                  type="text"
                  required
                  className="w-full h-12 px-4 rounded-xl border outline-none transition bg-gray-50 border-gray-200 focus:border-blue-500"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1 ml-1 text-gray-700">E-MAIL</label>
              <input
                type="email"
                required
                className="w-full h-12 px-4 rounded-xl border outline-none transition bg-gray-50 border-gray-200 focus:border-blue-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold mb-1 ml-1 text-gray-700">SENHA</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full h-12 px-4 rounded-xl border outline-none transition pr-12 bg-gray-50 border-gray-200 focus:border-blue-500"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="******"
              />
               <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold h-12 rounded-xl transition shadow-lg flex items-center justify-center text-base mt-2 bg-primary text-white hover:bg-green-700 shadow-green-200"
            >
              {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'Cadastrar' : 'Entrar na Conta')}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            {isRegistering ? 'Já tem uma conta?' : 'Não tem conta ainda?'}
          </p>
          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="font-bold hover:underline text-blue-600"
          >
            {isRegistering ? 'Fazer Login' : 'Criar conta grátis'}
          </button>
        </div>
      </div>
    </div>
  );
}