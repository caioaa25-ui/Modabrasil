import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Seller() {
  const { profile } = useAuth();
  
  if (profile?.role !== 'seller') {
    return <div className="p-10 text-center">Acesso restrito a vendedores. <Link to="/" className="text-blue-600">Voltar</Link></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Painel do Parceiro</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Vendas Totais</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Comissão Pendente</p>
          <p className="text-2xl font-bold">R$ 0,00</p>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded text-blue-800 text-sm">
        Use o link <b>?seller={profile.uid}</b> ao compartilhar produtos para ganhar comissão.
      </div>
    </div>
  );
}