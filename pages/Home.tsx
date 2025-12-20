import React from 'react';
import { Product } from '../types';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vestido Linho Areia',
    description: 'Vestido midi em linho puro com modelagem evasê e decote canoa. Perfeito para dias quentes com sofisticação.',
    price: 349.90,
    images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800'],
    category: 'Feminino',
    sizes: ['P', 'M', 'G'],
    stock: 10
  },
  {
    id: '2',
    name: 'Blazer Estruturado Navy',
    description: 'Blazer com corte de alfaiataria italiana, confeccionado em lã fria premium. Ideal para um visual business moderno.',
    price: 599.00,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'],
    category: 'Masculino',
    sizes: ['M', 'G', 'GG'],
    stock: 5
  },
  {
    id: '3',
    name: 'Bolsa Couro Legítimo',
    description: 'Acessório atemporal em couro bovino selecionado com ferragens em banho dourado.',
    price: 450.00,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800'],
    category: 'Acessórios',
    sizes: ['Único'],
    stock: 15
  },
  {
    id: '4',
    name: 'Camisa Algodão Egípcio',
    description: 'Camisa social branca de alta gramatura com toque sedoso e caimento impecável.',
    price: 289.00,
    images: ['https://images.unsplash.com/photo-1596755094514-f87034a26cc1?q=80&w=800'],
    category: 'Masculino',
    sizes: ['P', 'M', 'G', 'GG'],
    stock: 20
  }
];

interface HomeProps {
  onProductClick: (product: Product) => void;
}

export const Home: React.FC<HomeProps> = ({ onProductClick }) => {
  return (
    <div className="fade-in">
      <section className="relative h-[85vh] bg-gray-200 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000" 
          className="w-full h-full object-cover opacity-90 scale-105"
          alt="Banner Moda Brasil"
        />
        <div className="absolute inset-0 bg-black/10 flex flex-col items-center justify-center text-white p-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.5em] mb-4 font-semibold">Lançamento</span>
          <h2 className="text-5xl md:text-8xl font-serif italic mb-6 text-center">Essência Brasileira</h2>
          <p className="text-sm md:text-lg uppercase tracking-[0.3em] mb-10 text-center max-w-lg leading-relaxed">
            Uma coleção que celebra a luz e as texturas do nosso Brasil.
          </p>
          <button className="bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-500 shadow-xl">
            Ver Coleção
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <h3 className="text-4xl font-serif italic">Peças de Destaque</h3>
          <div className="h-[1px] bg-black/10 flex-grow mx-8 hidden md:block"></div>
          <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">Curadoria Exclusiva</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURED_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              <div className="relative overflow-hidden mb-6 bg-gray-50 aspect-[3/4]">
                <img 
                  src={product.images[0]} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-in-out"
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition duration-500"></div>
                <div className="absolute bottom-6 left-0 right-0 flex justify-center translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition duration-500">
                  <button className="bg-white text-black text-[10px] uppercase font-bold tracking-widest px-8 py-4 shadow-lg">
                    Rápida Visualização
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-accent uppercase tracking-widest font-bold mb-2">{product.category}</p>
              <h4 className="text-sm font-medium mb-2 group-hover:text-accent transition">{product.name}</h4>
              <p className="font-bold text-lg">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-24 border-y border-gray-100">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000" className="w-full h-[600px] object-cover" />
            <div className="absolute -bottom-8 -right-8 bg-bgGray p-12 hidden lg:block">
              <p className="text-2xl font-serif italic max-w-xs">"A moda passa, o estilo brasileiro é eterno."</p>
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-accent mb-4">Sobre Nós</h4>
            <h3 className="text-5xl font-serif mb-8 leading-tight">Onde a Tradição <br/> encontra o Amanhã.</h3>
            <p className="text-gray-600 leading-loose mb-10">
              Nascida no coração do Rio de Janeiro, a Moda Brasil busca traduzir a leveza tropical em peças estruturadas e atemporais. Cada fio conta uma história de artesanato e paixão.
            </p>
            <button className="border-b-2 border-black pb-2 text-xs font-bold uppercase tracking-widest hover:text-accent hover:border-accent transition">
              Nossa Manifesto
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};