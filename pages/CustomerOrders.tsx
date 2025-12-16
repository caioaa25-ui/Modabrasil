import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByCustomer } from '../services/db';
import { Order } from '../types';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetch = async () => {
      const data = await getOrdersByCustomer(user.uid);
      setOrders(data);
      setLoading(false);
    };
    fetch();
  }, [user, navigate]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-500" />;
      case 'shipped': return <Truck className="text-blue-500" />;
      case 'pending': return <Clock className="text-yellow-500" />;
      default: return <Package className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const map: any = {
      pending: 'Aguardando Pagamento/Processamento',
      paid: 'Pago - Em preparação',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return map[status] || status;
  };

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Meus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded text-center shadow-sm">
          <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
          <button onClick={() => navigate('/')} className="text-primary font-bold hover:underline">
            Ir para a loja
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                <div>
                  <span className="text-sm text-gray-500">Pedido realizado em</span>
                  <p className="font-medium text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Total</span>
                  <p className="font-bold text-gray-800">R$ {order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="mr-3">{getStatusIcon(order.status)}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">Status: {getStatusText(order.status)}</h3>
                    {order.trackingCode && (
                      <p className="text-sm text-blue-600 mt-1">Rastreio: {order.trackingCode}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex py-2">
                      <img src={item.images[0]} alt="" className="w-16 h-16 object-cover rounded mr-4" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x • {item.selectedSize} • {item.selectedColor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}