import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/db';
import { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

// Fictitious Products Data
export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'dummy-1',
    name: 'Camiseta Algodão Premium Básica Branca',
    description: 'Camiseta 100% algodão penteado, fio 30.1. Conforto e durabilidade para o dia a dia. Modelagem slim fit.',
    basePrice: 49.90,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco', 'Preto', 'Cinza'],
    stock: 50,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: 'dummy-2',
    name: 'Calça Jeans Skinny Masculina Azul Escuro',
    description: 'Calça jeans com elastano, corte moderno e confortável. Lavagem escura ideal para ocasiões casuais.',
    basePrice: 119.90,
    sizes: ['38', '40', '42', '44'],
    colors: ['Azul Escuro'],
    stock: 30,
    images: ['https://images.unsplash.com/photo-1542272617-08f08630329e?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: 'dummy-3',
    name: 'Tênis Esportivo Running Leve Confortável',
    description: 'Tênis ideal para corridas e caminhadas. Solado com amortecimento e tecido respirável.',
    basePrice: 199.90,
    sizes: ['39', '40', '41', '42'],
    colors: ['Preto/Branco', 'Azul/Laranja'],
    stock: 20,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: 'dummy-4',
    name: 'Relógio Smartwatch Pro Resistente à Água',
    description: 'Monitoramento cardíaco, notificações de celular e bateria de longa duração. Pulseira de silicone.',
    basePrice: 249.90,
    sizes: ['Único'],
    colors: ['Preto'],
    stock: 15,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60']
  },
  {
    id: 'dummy-5',
    name: 'Bolsa Feminina Couro Ecológico Transversal',
    description: 'Bolsa prática e elegante, com alça regulável e compartimentos internos.',
    basePrice: 89.90,
    sizes: ['Único'],
    colors: ['Marrom', 'Preto', 'Bege'],
    stock: 40,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60']
  }
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const dbProducts = await getProducts();
        // If DB is empty, use Dummy products for display/testing
        if (dbProducts.length === 0) {
           setProducts(DUMMY_PRODUCTS);
        } else {
           setProducts(dbProducts);
        }
      } catch (e) {
        console.error(e);
        // Fallback to dummy if error
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleProductInteraction = (productId: string) => {
    if (!user) {
      // User requested behavior: Click product -> Go to Login if not authenticated
      navigate('/login');
    } else {
      navigate(`/product/${productId}`);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      
      {/* Banner Section */}
      <div className="px-4 pt-4">
        <div className="w-full rounded-lg overflow-hidden relative h-48 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-sm">
          {/* Background Image Effect */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1374&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10 p-6 flex flex-col justify-center h-full items-start">
            <p className="text-[10px] md:text-xs font-bold tracking-widest mb-1 text-gray-200">OFERTAS DA SEMANA</p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
              MODA BRASIL<br/>COLEÇÃO 2025
            </h2>
            <button className="bg-white text-blue-900 font-bold py-2 px-6 rounded-md text-sm hover:bg-gray-100 transition shadow-sm">
              Ver ofertas
            </button>
          </div>
        </div>
      </div>

      {/* History/Products Section */}
      <div className="px-4 mt-6">
        <h2 className="text-gray-600 text-lg mb-3">Baseado na sua última visita</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.map(product => {
            const oldPrice = product.basePrice * 1.15;
            return (
              <div 
                key={product.id} 
                onClick={() => handleProductInteraction(product.id!)}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col relative cursor-pointer active:scale-95 transition-transform"
              >
                <div className="relative w-full pt-[100%] border-b border-gray-50">
                  <img 
                    src={product.images[0] || 'https://via.placeholder.com/400x500?text=Sem+Imagem'} 
                    alt={product.name}
                    className="absolute top-0 left-0 w-full h-full object-contain p-2"
                  />
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-xs text-gray-700 font-normal line-clamp-2 mb-2 h-[32px]">
                    {product.name}
                  </h3>

                  <div className="mt-auto">
                      <span className="text-xs text-gray-400 line-through block">
                      R$ {oldPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-normal text-gray-800 leading-none">
                        R$ {Math.floor(product.basePrice)},<span className="text-xs">{product.basePrice.toFixed(2).split('.')[1]}</span>
                      </span>
                      <span className="text-[10px] text-green-600 font-medium">
                        15% OFF
                      </span>
                    </div>
                    <p className="text-[10px] text-green-600 mt-1">10x R$ {(product.basePrice / 10).toFixed(2).replace('.', ',')} sem juros</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}