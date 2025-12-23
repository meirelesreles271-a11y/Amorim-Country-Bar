
import React, { useState } from 'react';
import { Command } from '../types';
import { Beer, Search, Filter, Trash2, ChevronRight } from 'lucide-react';

interface CommandListProps {
  commands: Command[];
}

const CommandList: React.FC<CommandListProps> = ({ commands }) => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [search, setSearch] = useState('');

  const filteredCommands = commands.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.tableNumber.includes(search) || 
                         (c.customerName?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold country-font text-[#d4af37]">Comandas</h2>
          <p className="text-[#8b4513]">Gerencie o consumo das mesas</p>
        </div>
        
        <div className="flex gap-2">
           {['all', 'open', 'closed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`
                  px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all
                  ${filter === f ? 'bg-[#8b4513] border-[#8b4513] text-white' : 'bg-[#2a1f18] border-[#3d2b1f] text-[#8b4513]'}
                `}
              >
                {f === 'all' ? 'Tudo' : f === 'open' ? 'Abertas' : 'Fechadas'}
              </button>
           ))}
        </div>
      </div>

      <div className="relative">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b4513]" size={18} />
         <input 
            type="text" 
            placeholder="Buscar por mesa ou nome..."
            className="w-full bg-[#2a1f18] border border-[#3d2b1f] rounded-xl py-3 pl-12 pr-4 text-[#f3e5ab] outline-none focus:border-[#d4af37]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredCommands.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-[#3d2b1f] rounded-3xl text-[#3d2b1f]">
              <Beer size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold text-xl">Nenhuma comanda encontrada</p>
           </div>
         ) : (
           filteredCommands.map(cmd => (
              <div key={cmd.id} className="bg-[#2a1f18] border border-[#3d2b1f] rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 bg-[#3d2b1f] rounded-xl flex items-center justify-center text-[#d4af37] font-bold text-xl border border-[#4d3b2f]">
                          {cmd.tableNumber}
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          cmd.status === 'open' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                       }`}>
                          {cmd.status === 'open' ? 'Em Consumo' : 'Finalizada'}
                       </span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-1">{cmd.customerName || `Mesa ${cmd.tableNumber}`}</h4>
                    <p className="text-xs text-[#8b4513] flex items-center gap-1 mb-6">
                       Aberta às {new Date(cmd.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="space-y-2 mb-6 h-24 overflow-y-auto no-scrollbar">
                       {cmd.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-[#8b4513]">
                             <span>{item.quantity}x {item.name}</span>
                             <span className="text-[#f3e5ab]">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                       ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#3d2b1f]">
                       <div>
                          <p className="text-[10px] font-bold text-[#8b4513] uppercase">Valor Total</p>
                          <p className="text-2xl font-bold text-[#d4af37]">R$ {cmd.total.toFixed(2)}</p>
                       </div>
                       <button className="bg-[#3d2b1f] p-3 rounded-xl text-[#d4af37] hover:bg-[#8b4513] hover:text-white transition-all">
                          <ChevronRight size={20} />
                       </button>
                    </div>
                 </div>
              </div>
           ))
         )}
      </div>
    </div>
  );
};

export default CommandList;
