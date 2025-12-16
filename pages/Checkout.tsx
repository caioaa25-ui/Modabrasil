import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Order } from '../types';
import { createOrder } from '../services/db';
import { useNavigate } from 'react-router-dom';
import { Loader2, QrCode, CreditCard, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [sellers, setSellers] = useState<UserProfile[]>([]);
  const [selectedSeller, setSelectedSeller] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [commissionRate, setCommissionRate] = useState(10); // Default 10%

  // Fetch verified sellers and commission config
  useEffect(() => {
    const init = async () => {
      // Get sellers
      const q = query(collection(db, "users"), where("role", "==", "seller"));
      const snap = await getDocs(q);
      const sellersList = snap.docs.map(d => d.data() as UserProfile);
      setSellers(sellersList);
      
      // Auto-select seller if user came from a referral link
      const referredId = localStorage.getItem('referredSellerId');
      if (referredId) {
        // Verify if seller exists in the list
        const exists = sellersList.find(s => s.uid === referredId);
        if (exists) {
          setSelectedSeller(referredId);
        }
      }
      
      setLoading(false);
    };
    init();
  }, []);

  const handleFinish = async () => {
    if (!user || items.length === 0) return;
    setProcessing(true);

    try {
      // 1. Calculate Commission
      let commission = 0;
      let sellerName = undefined;
      
      if (selectedSeller) {
         commission = total * (commissionRate / 100);
         const sellerDoc = sellers.find(s => s.uid === selectedSeller);
         sellerName = sellerDoc?.name;
      }

      // 2. Create Order
      const newOrder: Order = {
        customerId: user.uid,
        customerName: profile?.name || user.email || 'Cliente',
        sellerId: selectedSeller || undefined,
        sellerName,
        items,
        totalAmount: total,
        commissionAmount: commission,
        status: 'pending', // Waiting payment confirmation
        createdAt: Date.now(),
        paymentMethod
      };

      await createOrder(newOrder);
      
      // Clear referral after purchase
      localStorage.removeItem('referredSellerId');

      // 3. Simulate Payment delay
      setTimeout(() => {
        clearCart();
        setSuccess(true);
        setProcessing(false);
      }, 2000);

    } catch (error) {
      console.error(error);
      setProcessing(false);
      alert('Erro ao processar pedido.');
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow">
        <div className="text-green-500 mb-4"><CheckCircle size={64} /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pedido Realizado!</h2>
        <p className="text-gray-600 mb-6">Obrigado por comprar na Moda Brasil.</p>
        <button onClick={() => navigate('/orders')} className="bg-primary text-white px-6 py-2 rounded-md">
          Ver Meus Pedidos
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          {items.map(item => (
            <div key={item.cartId} className="flex justify-between py-2 border-b last:border-0">
              <span className="text-sm">
                {item.quantity}x {item.name} ({item.selectedSize})
              </span>
              <span className="font-medium">R$ {item.basePrice.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Seller Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3">Vendedor (Opcional)</h3>
          <p className="text-sm text-gray-500 mb-2">Se um vendedor te indicou, selecione abaixo:</p>
          {loading ? (
             <Loader2 className="animate-spin" />
          ) : (
            <select
              className="w-full border p-2 rounded focus:ring-primary focus:border-primary bg-white"
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
            >
              <option value="">-- Sem vendedor / Direto da Loja --</option>
              {sellers.map(s => (
                <option key={s.uid} value={s.uid}>{s.name} ({s.email})</option>
              ))}
            </select>
          )}
          {selectedSeller && (
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <CheckCircle size={12} className="mr-1" /> Vendedor aplicado ao pedido
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Pagamento</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setPaymentMethod('pix')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center transition ${
                paymentMethod === 'pix' ? 'border-primary bg-green-50 text-primary' : 'hover:bg-gray-50'
              }`}
            >
              <QrCode size={32} className="mb-2" />
              <span className="font-medium">Pix</span>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border rounded-lg flex flex-col items-center justify-center transition ${
                paymentMethod === 'card' ? 'border-primary bg-green-50 text-primary' : 'hover:bg-gray-50'
              }`}
            >
              <CreditCard size={32} className="mb-2" />
              <span className="font-medium">Cartão</span>
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded text-sm text-gray-600">
            {paymentMethod === 'pix' 
              ? 'Ao finalizar, você receberá o código Pix para pagamento imediato.' 
              : 'Simulação: Pagamento com cartão será aprovado automaticamente.'}
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={processing}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition flex items-center justify-center"
        >
          {processing ? <Loader2 className="animate-spin mr-2" /> : 'Pagar Agora'}
        </button>
      </div>
    </div>
  );
}