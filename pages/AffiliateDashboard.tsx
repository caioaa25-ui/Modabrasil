import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAffiliateStats } from '../services/db';
import { UserProfile, Commission } from '../types';
import { Copy, Users, MousePointer, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function AffiliateDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<{
    clicks: number;
    referrals: number;
    referralsList: UserProfile[];
    commissionsList: Commission[];
    pendingBalance: number;
    totalEarned: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const loadStats = async () => {
      const data = await getAffiliateStats(user.uid);
      setStats(data);
    };
    loadStats();
  }, [user, navigate]);

  if (!profile?.affiliateCode) return <div className="p-10 text-center">Carregando perfil de afiliado...</div>;

  // --- CORREÇÃO DO LINK ---
  // Formato Seguro: https://site.com/?ref=CODIGO#/login
  // Isso garante que o navegador leia o parâmetro antes de carregar o React
  const origin = window.location.origin;
  const affiliateLink = `${origin}/?ref=${profile.affiliateCode}#/login`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Programa de Afiliados</h1>
        <p className="opacity-90">Indique amigos e ganhe 5% de comissão em todas as compras.</p>
        
        <div className="mt-6 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-sm">
          <p className="text-sm text-gray-200 mb-1">Seu Link Exclusivo</p>
          <div className="flex gap-2">
            <input 
              readOnly 
              value={affiliateLink} 
              className="bg-black/20 text-white w-full px-3 py-2 rounded border border-white/10 text-sm focus:outline-none"
            />
            <button 
              onClick={copyToClipboard}
              className="bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-gray-100 transition flex items-center gap-2"
            >
              {copied ? <CheckCircle size={16}/> : <Copy size={16}/>}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MousePointer size={18} />
            <span className="text-sm font-bold">Cliques</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.clicks || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users size={18} />
            <span className="text-sm font-bold">Indicados</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats?.referrals || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Clock size={18} />
            <span className="text-sm font-bold">Pendente</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">R$ {stats?.pendingBalance.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <DollarSign size={18} />
            <span className="text-sm font-bold">Aprovado</span>
          </div>
          <p className="text-2xl font-bold text-green-600">R$ {stats?.totalEarned.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lista de Comissões */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-700">Extrato Financeiro</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {stats?.commissionsList.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">Nenhuma comissão ainda.</p>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3">Data</th>
                    <th className="p-3">Origem</th>
                    <th className="p-3 text-right">Valor</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats?.commissionsList.map((comm, idx) => (
                    <tr key={idx}>
                      <td className="p-3 text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="font-medium text-gray-800">{comm.fromUserName.split(' ')[0]}</div>
                        <div className="text-xs text-gray-400">Pedido #{comm.orderId.slice(0,4)}</div>
                      </td>
                      <td className="p-3 text-right font-bold text-green-600">
                        + R$ {comm.amount.toFixed(2)}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold
                          ${comm.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                            comm.status === 'approved' || comm.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {comm.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Lista de Indicados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-700">Usuários Indicados</h3>
          </div>
          <div className="p-4">
            {stats?.referralsList.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">
                Compartilhe seu link para começar a ver indicados aqui.
              </p>
            ) : (
              <ul className="space-y-3">
                {stats?.referralsList.map((refUser, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {refUser.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{refUser.name}</p>
                      <p className="text-xs text-gray-400">Cadastro via link</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}