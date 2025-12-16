import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { createUserProfile } from '../services/db';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile({ uid: cred.user.uid, email, name, role });
      }
      navigate('/');
    } catch (err: any) {
      alert('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" placeholder="Nome Completo" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" required />
              <div className="flex gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={role === 'customer'} onChange={() => setRole('customer')} /> Cliente
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={role === 'seller'} onChange={() => setRole('seller')} /> Vendedor/Parceiro
                </label>
              </div>
            </>
          )}
          
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          
          <button disabled={loading} className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-green-700">
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center mt-4 text-blue-600 text-sm">
          {isLogin ? 'Não tem conta? Crie agora' : 'Já tem conta? Entre'}
        </button>
      </div>
    </div>
  );
}