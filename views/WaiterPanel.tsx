
import React, { useState } from 'react';
import { Product, Command, Category } from '../types';
import { openCommand, addItemToCommand } from '../dataStore';
import { 
  Plus, 
  Search, 
  PlusCircle, 
  MinusCircle, 
  ShoppingCart, 
  ChevronRight,
  User,
  Hash
} from 'lucide-react';

interface WaiterPanelProps {
  products: Product[];
  commands: Command[];
}

const WaiterPanel: React.FC<WaiterPanelProps> = ({ products, commands }) => {
  const [view, setView] = useState<'list' | 'order'>('list');
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [showNewCommand, setShowNewCommand] = useState(false);
  
  const [newCmdData, setNewCmdData] = useState({ table: '', name: '' });

  const openCommands = commands.filter(c => c.status === 'open');

  const handleOpenCommand = () => {
    if (newCmdData.table) {
      const cmd = openCommand(newCmdData.table, newCmdData.name);
      setSelectedCommand(cmd);
      setView('order');
      setShowNewCommand(false);
      setNewCmdData({ table: '', name: '' });
    }
  };

  const filteredProducts = products.filter(p => 
    (activeCategory === 'Todos' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="bg-[#2a1f18] p-4 rounded-xl border border-[#3d2b1f] flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold country-font text-[#d4af37]">Central do Garçom</h2>
          <button 
            onClick={() => setShowNewCommand(true)}
            className="bg-[#8b4513] p-2 rounded-full text-white shadow-lg active:scale-90 transition-transform"
          >
            <Plus size={20} />
          </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#8b4513] uppercase tracking-wider">Comandas Ativas</h3>
          {openCommands.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-[#3d2b1f] rounded-2xl text-[#3d2b1f]">
               Nenhuma comanda aberta
            </div>
          ) : (
            openCommands.map(cmd => (
              <button 
                key={cmd.id}
                onClick={() => { setSelectedCommand(cmd); setView('order'); }}
                className="w-full bg-[#2a1f18] border border-[#3d2b1f] p-4 rounded-xl flex items-center justify-between group active:bg-[#3d2b1f] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3d2b1f] flex items-center justify-center text-[#d4af37] font-bold text-lg">
                    {cmd.tableNumber}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{cmd.customerName || `Mesa ${cmd.tableNumber}`}</p>
                    <p className="text-xs text-[#8b4513]">{cmd.items.length} itens pedidos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#d4af37] font-bold">R$ {cmd.total.toFixed(2)}</span>
                  <ChevronRight size={20} className="text-[#3d2b1f] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="animate-fadeIn pb-24">
          <button 
            onClick={() => setView('list')}
            className="mb-4 text-[#8b4513] flex items-center gap-1 hover:text-[#d4af37] transition-colors"
          >
             &larr; Voltar para Comandas
          </button>

          <div className="bg-[#8b4513] p-4 rounded-xl text-white mb-6 flex justify-between items-center shadow-lg">
             <div>
                <p className="text-xs opacity-75 uppercase">Mesa {selectedCommand?.tableNumber}</p>
                <h4 className="text-xl font-bold">{selectedCommand?.customerName || 'Cliente sem nome'}</h4>
             </div>
             <div className="text-right">
                <p className="text-xs opacity-75 uppercase">Total</p>
                <h4 className="text-xl font-bold">R$ {selectedCommand?.total.toFixed(2)}</h4>
             </div>
          </div>

          {/* Product Picker */}
          <div className="space-y-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b4513]" size={16} />
                <input 
                  type="text" 
                  placeholder="Pesquisar item..."
                  className="w-full bg-[#2a1f18] border border-[#3d2b1f] rounded-lg py-2 pl-10 text-sm focus:outline-none focus:border-[#d4af37]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Todos', ...Object.values(Category)].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat as Category | 'Todos')}
                    className={`
                      px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border
                      ${activeCategory === cat ? 'bg-[#d4af37] text-[#1a1410] border-[#d4af37]' : 'bg-transparent text-[#8b4513] border-[#3d2b1f]'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             <div className="grid grid-cols-1 gap-2">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-[#2a1f18] border border-[#3d2b1f] p-3 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-xs text-[#d4af37]">R$ {p.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        addItemToCommand(selectedCommand!.id, p.id, 1);
                        // Refresh selected command locally to reflect UI changes if needed
                        // Though BroadcastChannel will sync it, usually we want immediate visual feedback
                      }}
                      className="bg-[#3d2b1f] p-2 rounded-lg text-[#d4af37] hover:bg-[#8b4513] hover:text-white transition-colors"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Cart if needed */}
      {view === 'order' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm">
             <button className="w-full bg-[#8b4513] text-white py-4 rounded-full flex items-center justify-center gap-2 font-bold shadow-2xl animate-bounce">
                <ShoppingCart size={20} />
                <span>Ver Itens na Comanda</span>
             </button>
          </div>
      )}

      {/* New Command Dialog */}
      {showNewCommand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
             <div className="bg-[#2a1f18] w-full max-w-sm rounded-2xl border border-[#3d2b1f] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-[#3d2b1f]">
                   <h3 className="text-xl font-bold country-font text-[#d4af37]">Abrir Nova Comanda</h3>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8b4513] uppercase flex items-center gap-1">
                        <Hash size={12} /> Mesa
                      </label>
                      <input 
                        type="number" 
                        autoFocus
                        placeholder="Ex: 05"
                        className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-xl p-4 text-2xl font-bold text-center focus:border-[#d4af37] outline-none"
                        value={newCmdData.table}
                        onChange={(e) => setNewCmdData({...newCmdData, table: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-[#8b4513] uppercase flex items-center gap-1">
                        <User size={12} /> Nome do Cliente (Opcional)
                      </label>
                      <input 
                        type="text" 
                        placeholder="Ex: Cowboy Bob"
                        className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-xl p-4 focus:border-[#d4af37] outline-none"
                        value={newCmdData.name}
                        onChange={(e) => setNewCmdData({...newCmdData, name: e.target.value})}
                      />
                   </div>
                </div>
                <div className="p-6 flex gap-3">
                   <button 
                      onClick={() => setShowNewCommand(false)}
                      className="flex-1 py-4 text-[#8b4513] font-bold"
                   >
                     Cancelar
                   </button>
                   <button 
                      onClick={handleOpenCommand}
                      className="flex-1 bg-[#8b4513] text-white py-4 rounded-xl font-bold shadow-lg"
                   >
                     Abrir Rancho
                   </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default WaiterPanel;
