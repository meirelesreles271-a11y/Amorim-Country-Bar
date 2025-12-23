
import React, { useState } from 'react';
import { Product, Category } from '../types';
import { addProduct, deleteProduct, updateProduct } from '../dataStore';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Sparkles, 
  Loader2,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { generateProductDetails, generateProductImage } from '../geminiService';

interface InventoryProps {
  products: Product[];
}

const Inventory: React.FC<InventoryProps> = ({ products }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: Category.BEER,
    imageUrl: ''
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (formData.name && formData.price) {
      if (formData.id) {
        updateProduct(formData as Product);
      } else {
        addProduct({
            ...formData,
            id: Math.random().toString(36).substr(2, 9),
        } as Product);
      }
      setIsModalOpen(false);
      setFormData({ name: '', description: '', price: 0, category: Category.BEER, imageUrl: '' });
    }
  };

  const handleAICompose = async () => {
    if (!formData.name) return alert('Dê um nome ao produto primeiro!');
    
    setIsLoadingAI(true);
    try {
      const details = await generateProductDetails(formData.name);
      const imageUrl = await generateProductImage(formData.name);
      
      setFormData(prev => ({
        ...prev,
        description: details.description,
        price: details.suggestedPrice || prev.price,
        imageUrl: imageUrl || prev.imageUrl
      }));
    } catch (error) {
      console.error(error);
      alert('Erro ao consultar a IA. Verifique sua chave API.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold country-font text-[#d4af37]">Estoque de Mantimentos</h2>
          <p className="text-[#8b4513]">Gerencie o que é servido no Amorim Bar</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#8b4513] hover:bg-[#a0522d] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Produto</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b4513]" size={20} />
        <input 
          type="text" 
          placeholder="Buscar produto por nome ou categoria..." 
          className="w-full bg-[#2a1f18] border border-[#3d2b1f] rounded-xl py-3 pl-12 pr-4 text-[#f3e5ab] focus:outline-none focus:border-[#d4af37] transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-[#2a1f18] rounded-xl border border-[#3d2b1f] overflow-hidden group shadow-md hover:shadow-xl transition-all">
            <div className="h-48 overflow-hidden relative">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 right-2 bg-[#d4af37] text-[#1a1410] text-[10px] font-bold px-2 py-1 rounded uppercase">
                {product.category}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-white">{product.name}</h4>
                <span className="text-[#d4af37] font-bold">R$ {product.price.toFixed(2)}</span>
              </div>
              <p className="text-[#8b4513] text-sm line-clamp-2 h-10 mb-4">{product.description}</p>
              <div className="flex gap-2">
                <button 
                    onClick={() => { setFormData(product); setIsModalOpen(true); }}
                    className="flex-1 bg-[#3d2b1f] hover:bg-[#4d3b2f] text-[#f3e5ab] py-2 rounded flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit size={16} />
                  <span>Editar</span>
                </button>
                <button 
                    onClick={() => deleteProduct(product.id)}
                    className="p-2 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2a1f18] w-full max-w-2xl rounded-2xl border border-[#3d2b1f] overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-[#3d2b1f] flex justify-between items-center bg-[#1a1410]">
              <h3 className="text-xl font-bold country-font text-[#d4af37] flex items-center gap-2">
                <Plus size={24} />
                {formData.id ? 'Editar Produto' : 'Cadastrar Mantimento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8b4513] hover:text-[#f3e5ab] transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#8b4513]">Nome do Produto</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-lg p-3 focus:border-[#d4af37] outline-none"
                    placeholder="Ex: Chopp de Vinho"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#8b4513]">Categoria</label>
                  <select 
                    className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-lg p-3 focus:border-[#d4af37] outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#8b4513] flex justify-between">
                    <span>Descrição</span>
                    <button 
                        onClick={handleAICompose}
                        disabled={isLoadingAI}
                        className="text-[#d4af37] flex items-center gap-1 hover:underline text-[10px]"
                    >
                      {isLoadingAI ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                      GERAR COM IA GEMINI
                    </button>
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-lg p-3 focus:border-[#d4af37] outline-none"
                    placeholder="Conte sobre o sabor deste produto..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-[#8b4513]">Preço de Venda (R$)</label>
                    <input 
                      type="number" 
                      className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-lg p-3 focus:border-[#d4af37] outline-none"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-[#8b4513]">URL da Imagem</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-[#1a1410] border border-[#3d2b1f] rounded-lg p-3 focus:border-[#d4af37] outline-none text-xs"
                            placeholder="https://..."
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                        />
                        <div className="w-12 h-12 rounded border border-[#3d2b1f] bg-black overflow-hidden flex items-center justify-center">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon size={20} className="text-[#3d2b1f]" />
                            )}
                        </div>
                    </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#1a1410] border-t border-[#3d2b1f] flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-[#3d2b1f] rounded-lg hover:bg-[#2a1f18] transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3 bg-[#8b4513] text-white rounded-lg hover:bg-[#a0522d] font-bold shadow-lg transition-all"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
