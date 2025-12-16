import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Loader2, ArrowLeft, ShieldCheck, Trophy, Heart } from 'lucide-react';
import { DUMMY_PRODUCTS } from './Home'; // Import dummy data

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Check for Affiliate/Seller Link
  useEffect(() => {
    const sellerId = searchParams.get('seller');
    if (sellerId) {
      // Store the referrer seller ID in local storage for the checkout process
      localStorage.setItem('referredSellerId', sellerId);
      console.log('Seller referral captured:', sellerId);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      // First check if it's a dummy product
      const dummy = DUMMY_PRODUCTS.find(p => p.id === id);
      if (dummy) {
        setProduct(dummy);
        setLoading(false);
        return;
      }

      // If not dummy, try DB
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() } as Product);
        }
      } catch (error) {
        console.error("Error loading product", error);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>;
  if (!product) return <div className="text-center p-20">Produto não encontrado.</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm md:p-4 min-h-[600px]">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Gallery */}
        <div className="md:w-2/3 flex gap-4">
          {/* Thumbnails */}
          <div className="hidden md:flex flex-col gap-2">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onMouseEnter={() => setCurrentImage(i)}
                className={`w-12 h-12 rounded border cursor-pointer hover:border-primary p-1 ${currentImage === i ? 'border-primary' : 'border-gray-200'}`}
              >
                <img src={img} className="w-full h-full object-contain" alt="" />
              </div>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="flex-1 relative flex justify-center items-center bg-white min-h-[400px]">
             <img 
               src={product.images[currentImage] || 'https://via.placeholder.com/600x800'} 
               alt={product.name} 
               className="max-w-full max-h-[500px] object-contain"
             />
          </div>
        </div>

        {/* Right Column: Buy Box */}
        <div className="md:w-1/3 border border-gray-200 rounded-lg p-4 h-fit md:sticky md:top-24">
          <div className="text-xs text-gray-500 mb-2">
            Novo | +100 vendidos
          </div>
          
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold text-gray-800 leading-snug flex-1">
              {product.name}
            </h1>
            <Heart className="text-blue-500 cursor-pointer hover:fill-current" size={24} />
          </div>

          <div className="mb-4">
            <span className="text-3xl font-light text-gray-800">
              R$ {product.basePrice.toFixed(2).replace('.', ',')}
            </span>
            <p className="text-sm text-green-600 font-medium mt-1">
              em 10x R$ {(product.basePrice / 10).toFixed(2).replace('.', ',')} sem juros
            </p>
            <p className="text-xs text-blue-600 font-medium mt-1 cursor-pointer">
              Ver os meios de pagamento
            </p>
          </div>

          <div className="mb-6 text-sm">
            <p className="text-green-600 font-bold flex items-center gap-1 mb-1">
              Chegará grátis amanhã
            </p>
            <p className="text-gray-500 text-xs">
              Comprando dentro das próximas 2 h 30 min
            </p>
            <div className="mt-2 text-gray-600 font-medium flex items-center gap-1">
               <ShieldCheck size={16} className="text-gray-400" />
               <span>Vendido por <span className="text-blue-600">Moda Brasil Oficial</span></span>
            </div>
          </div>

          {/* Variants */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Cor: <span className="font-normal">{selectedColor || 'Selecionar'}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 border rounded-md text-sm transition ${
                    selectedColor === color 
                      ? 'border-blue-600 text-blue-600 font-bold bg-blue-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-800 mb-2">Tamanho: <span className="font-normal">{selectedSize || 'Selecionar'}</span></p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-md text-sm transition ${
                    selectedSize === size 
                      ? 'border-blue-600 text-blue-600 font-bold bg-blue-50' 
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <p className="text-sm font-bold text-gray-800 mb-6">
            Estoque disponível ({product.stock})
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded text-base transition disabled:opacity-50"
              onClick={() => {
                if(!selectedSize || !selectedColor) { alert('Selecione cor e tamanho'); return; }
                addToCart(product, selectedSize, selectedColor);
                navigate('/cart');
              }}
              disabled={product.stock === 0}
            >
              Comprar agora
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor || added || product.stock === 0}
              className={`w-full font-bold py-3 rounded text-base transition ${
                added ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              } disabled:opacity-50`}
            >
              {added ? 'Adicionado' : 'Adicionar ao carrinho'}
            </button>
          </div>

          {/* Benefits */}
          <div className="mt-6 space-y-3 text-sm text-gray-500">
            <div className="flex gap-2">
               <ArrowLeft size={16} className="text-gray-400 mt-0.5" />
               <p><span className="text-blue-600 cursor-pointer">Devolução grátis.</span> Você tem 30 dias a partir da data de recebimento.</p>
            </div>
            <div className="flex gap-2">
               <ShieldCheck size={16} className="text-gray-400 mt-0.5" />
               <p><span className="text-blue-600 cursor-pointer">Compra Garantida</span>, receba o produto que está esperando ou devolvemos o dinheiro.</p>
            </div>
            <div className="flex gap-2">
               <Trophy size={16} className="text-gray-400 mt-0.5" />
               <p><span className="text-blue-600 cursor-pointer">Mercado Pontos.</span> Você soma pontos na compra.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description below */}
      <div className="border-t border-gray-200 mt-10 pt-10 md:w-2/3">
         <h2 className="text-2xl font-normal text-gray-800 mb-6">Descrição</h2>
         <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
           {product.description}
         </p>
      </div>
    </div>
  );
}