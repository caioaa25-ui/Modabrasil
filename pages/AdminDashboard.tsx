import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, deleteProduct, getAllUsers, deleteUser } from '../services/db';
import { Product, UserProfile } from '../types';
import { Trash2, Plus, Users, Package, Image as ImageIcon, Save, X } from 'lucide-react';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    basePrice: 0,
    stock: 10,
    images: [''],
    sizes: ['P', 'M', 'G'],
    colors: ['Padrão']
  });

  useEffect(() => {
    // Basic Security Check
    if (profile && profile.role !== 'admin') {
      navigate('/');
      return;
    }
    refreshData();
  }, [profile, navigate]);

  const refreshData = async () => {
    setLoading(true);
    const p = await getProducts();
    const u = await getAllUsers();
    setProducts(p);
    setUsers(u);
    setLoading(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.basePrice) return;

    try {
      await addProduct(newProduct as Product);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        description: '',
        basePrice: 0,
        stock: 10,
        images: [''],
        sizes: ['P', 'M', 'G'],
        colors: ['Padrão']
      });
      refreshData();
      alert('Produto adicionado com sucesso!');
    } catch (error) {
      alert('Erro ao adicionar produto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id);
      refreshData();
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário? O acesso dele será revogado.')) {
      await deleteUser(uid);
      refreshData();
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Administração</h1>
        <div className="flex bg-white rounded-lg shadow-sm border p-1">
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'products' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Package size={18} /> Produtos
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'users' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users size={18} /> Usuários
          </button>
        </div>
      </div>

      {/* --- TAB PRODUTOS --- */}
      {activeTab === 'products' && (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 shadow-sm"
            >
              <Plus size={20} /> Novo Produto
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4 text-left">Foto</th>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Preço</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="p-4">
                      <img src={p.images[0]} className="w-12 h-12 object-cover rounded border" alt="" />
                    </td>
                    <td className="p-4 font-medium">{p.name}</td>
                    <td className="p-4">R$ {p.basePrice.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => p.id && handleDeleteProduct(p.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* --- TAB USUÁRIOS --- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4 text-left">Usuário</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Função</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.uid}>
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                      ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 
                        u.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleDeleteUser(u.uid)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                        title="Excluir Conta"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL ADD PRODUTO --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Adicionar Produto</h2>
              <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nome do Produto</label>
                <input 
                  className="w-full border rounded p-2"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Preço (R$)</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full border rounded p-2"
                    value={newProduct.basePrice}
                    onChange={e => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Estoque</label>
                  <input 
                    type="number"
                    className="w-full border rounded p-2"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">URL da Imagem</label>
                <div className="flex gap-2">
                   <div className="bg-gray-100 p-2 rounded flex items-center justify-center text-gray-500">
                     <ImageIcon size={20} />
                   </div>
                   <input 
                    className="w-full border rounded p-2 text-sm"
                    placeholder="Cole o link da foto (https://...)"
                    value={newProduct.images?.[0]}
                    onChange={e => setNewProduct({...newProduct, images: [e.target.value]})}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                   Dica: Copie o endereço da imagem de um site ou use um serviço de hospedagem de imagens.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Descrição</label>
                <textarea 
                  className="w-full border rounded p-2 h-20"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>

              <button className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-green-700 flex justify-center gap-2">
                <Save size={20} /> Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}