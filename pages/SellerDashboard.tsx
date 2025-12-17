import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersBySeller, getProducts } from '../services/db';
import { Order, Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, AlertCircle, Link as LinkIcon, Copy, Share2, LayoutGrid, BarChart2, Check } from 'lucide-react';

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'financial'>('catalog');
  
  useEffect(() => {
    if (profile && profile.role !== 'seller') {
      navigate('/');
      return;
    }
    
    const fetchData = async () => {
      if (user) {
        // Fetch Seller Orders
        const ordersData = await getOrdersBySeller(user.uid);
        setOrders(ordersData);
        
        // Fetch All Products to Promote
        const productsData = await getProducts();
        setProducts(productsData);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, profile, navigate]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Solicitação de saque enviada para o admin!');
    setWithdrawAmount('');
  };

  const copyLink = (productId: string) => {
    if (!user) return;
    
    // CORREÇÃO: Usa o href completo e remove apenas o hash para garantir que o caminho base (path) seja mantido.
    // Isso evita o erro 404 em ambientes onde o app não está na raiz do domínio.
    const baseUrl = window.location.href.split('#')[0];
    const link = `${baseUrl}#/product/${productId}?seller=${user.uid}`;
    
    navigator.clipboard.writeText(link);
    
    // Visual feedback
    setCopiedId(productId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSales = orders.length;
  const totalCommission = orders.reduce((acc, curr) => acc + curr.commissionAmount, 0);
  const confirmedCommission = orders
    .filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Painel do Parceiro</h1>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white p-1 rounded-lg shadow-sm border border-gray-200">
           <button 
             onClick={() => setActiveTab('catalog')}
             className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition ${activeTab === 'catalog' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <LayoutGrid size={16} /> Vitrine
           </button>
           <button 
             onClick={() => setActiveTab('financial')}
             className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition ${activeTab === 'financial' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <BarChart2 size={16} /> Gestão
           </button>
        </div>
      </div>

      {/* --- TAB: CATALOG (DEFAULT) --- */}
      {activeTab === 'catalog' && (
        <div className="animate-in fade-in">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6 flex items-start gap-3">
             <Share2 className="text-blue-500 mt-1 flex-shrink-0" size={20} />
             <div>
                <p className="text-sm text-gray-700 font-medium">Área de Divulgação</p>
                <p className="text-xs text-gray-500">
                  Estes são os produtos disponíveis na loja. Copie o link e envie para seus clientes. 
                  A comissão é rastreada automaticamente.
                </p>
             </div>
          </div>
          
          {/* GRID LAYOUT LIKE HOME PAGE */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map(product => {
              const commission = product.basePrice * 0.10; // 10% commission example
              const isCopied = copiedId === product.id;

              return (
                <div 
                  key={product.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Image Container */}
                  <div className="relative w-full pt-[100%] border-b border-gray-50 bg-white">
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/400x500?text=Sem+Imagem'} 
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-contain p-2"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-xs text-gray-700 font-normal line-clamp-2 mb-2 h-[32px]">
                        {product.name}
                      </h3>
                      
                      <div className="mb-2">
                        <span className="text-base font-medium text-gray-800 leading-none">
                          R$ {Math.floor(product.basePrice)},<span className="text-xs">{product.basePrice.toFixed(2).split('.')[1]}</span>
                        </span>
                        <p className="text-[10px] text-green-600 font-bold mt-1 bg-green-50 inline-block px-1 rounded">
                          Sua comissão: R$ {commission.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>

                    {/* Discrete Action Button */}
                    <button 
                      onClick={() => copyLink(product.id!)}
                      className={`mt-2 w-full py-2 px-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                        isCopied 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                      }`}
                    >
                      {isCopied ? <Check size={14} /> : <LinkIcon size={14} />}
                      {isCopied ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </div>
                </div>
              );
            })}
            
            {products.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-500">
                Nenhum produto disponível.
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: FINANCIAL & STATS --- */}
      {activeTab === 'financial' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total de Vendas</p>
                  <h3 className="text-2xl font-bold">{totalSales}</h3>
                </div>
                <TrendingUp className="text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Comissão Disponível</p>
                  <h3 className="text-2xl font-bold text-green-600">R$ {confirmedCommission.toFixed(2)}</h3>
                </div>
                <Wallet className="text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Comissão Pendente</p>
                  <h3 className="text-2xl font-bold text-yellow-600">
                    R$ {(totalCommission - confirmedCommission).toFixed(2)}
                  </h3>
                </div>
                <AlertCircle className="text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales History */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold mb-4 text-gray-800">Histórico de Vendas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="p-3">Data</th>
                      <th className="p-3">Pedido</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Comissão</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-3">#{order.id?.slice(0,6)}...</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold 
                            ${order.status === 'paid' || order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium text-green-600">
                          + R$ {order.commissionAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                           Nenhuma venda realizada ainda.<br/>
                           <button onClick={() => setActiveTab('catalog')} className="text-blue-600 underline mt-2">
                             Comece a divulgar produtos
                           </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Withdrawal Request */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-fit border border-gray-100">
              <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Wallet size={18} /> Solicitar Saque Pix
              </h3>
              <div className="bg-gray-50 p-3 rounded mb-4 text-center">
                 <p className="text-xs text-gray-500">Saldo Disponível</p>
                 <p className="text-xl font-extrabold text-green-600">R$ {confirmedCommission.toFixed(2)}</p>
              </div>
              
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Valor do Saque</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input 
                      type="number" 
                      max={confirmedCommission}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full border rounded pl-8 p-2 focus:ring-primary focus:border-primary"
                      placeholder="0,00"
                    />
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Chave Pix</label>
                   <input type="text" className="w-full border rounded p-2 focus:ring-primary focus:border-primary" placeholder="CPF/Email/Tel" required />
                </div>
                <button 
                  type="submit" 
                  disabled={confirmedCommission <= 0 || !withdrawAmount}
                  className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm mt-2"
                >
                  Confirmar Saque
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}