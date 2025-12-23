
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { 
  Beer, 
  UtensilsCrossed, 
  Search, 
  MapPin, 
  Instagram, 
  Facebook
} from 'lucide-react';

interface DigitalMenuProps {
  products: Product[];
}

const DigitalMenu: React.FC<DigitalMenuProps> = ({ products }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');

  const filteredProducts = products.filter(p => 
    (activeCategory === 'Todos' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#1a1410] pb-20">
      {/* Header / Hero */}
      <div className="h-64 relative overflow-hidden">
        <img src="https://picsum.photos/1200/400?grayscale&random=99" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1410] to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-bold country-font text-[#d4af37] mb-2 tracking-tighter">AMORIM</h1>
            <p className="text-[#8b4513] text-xs font-bold uppercase tracking-[0.3em]">Country Bar & Grill</p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-[#f3e5ab]/60">
              <MapPin size={10} />
              <span>Av. Boiadeiro, 700 - Centro</span>
            </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10 space-y-6">
        {/* Search */}
        <div className="relative shadow-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b4513]" size={18} />
          <input 
            type="text" 
            placeholder="O que vamos pedir hoje?"
            className="w-full bg-[#2a1f18] border border-[#3d2b1f] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#8b4513] focus:outline-none focus:border-[#d4af37] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {['Todos', ...Object.values(Category)].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat as Category | 'Todos')}
              className={`
                px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                ${activeCategory === cat 
                  ? 'bg-[#d4af37] text-[#1a1410] border-[#d4af37] scale-105 shadow-lg' 
                  : 'bg-[#2a1f18] text-[#8b4513] border-[#3d2b1f]'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="flex gap-4 bg-[#2a1f18] rounded-2xl overflow-hidden border border-[#3d2b1f] group animate-slideUp">
              <div className="w-28 h-28 shrink-0">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#f3e5ab] text-lg leading-tight">{product.name}</h3>
                  <p className="text-xs text-[#8b4513] line-clamp-2 mt-1">{product.description}</p>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[#d4af37] font-bold">R$ {product.price.toFixed(2)}</span>
                   <div className="flex items-center gap-1 text-[8px] text-[#3d2b1f] uppercase font-bold">
                      {product.category === Category.BEER ? <Beer size={10} /> : <UtensilsCrossed size={10} />}
                      {product.category}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Social */}
      <footer className="mt-12 p-8 text-center space-y-6 border-t border-[#3d2b1f]">
         <div className="flex justify-center gap-6">
            <a href="#" className="text-[#8b4513] hover:text-[#d4af37]"><Instagram size={24} /></a>
            <a href="#" className="text-[#8b4513] hover:text-[#d4af37]"><Facebook size={24} /></a>
         </div>
         <p className="text-[10px] text-[#3d2b1f] uppercase tracking-widest">
            © 2024 Amorim Country Bar - Desenvolvido com Gemini AI
         </p>
      </footer>
    </div>
  );
};

export default DigitalMenu;
