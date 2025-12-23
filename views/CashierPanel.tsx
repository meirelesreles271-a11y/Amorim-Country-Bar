
import React, { useState } from 'react';
import { CashierState, Command } from '../types';
import { openCashier, closeCashier, closeCommand } from '../dataStore';
import { 
  Lock, 
  Unlock, 
  CreditCard, 
  Banknote, 
  Zap, 
  ReceiptText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CashierPanelProps {
  cashier: CashierState;
  commands: Command[];
}

const CashierPanel: React.FC<CashierPanelProps> = ({ cashier, commands }) => {
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [selectedCommandId, setSelectedCommandId] = useState<string | null>(null);

  const openCommands = commands.filter(c => c.status === 'open');
  const selectedCommand = commands.find(c => c.id === selectedCommandId);

  const handleCloseCommand = (method: 'cash' | 'card' | 'pix') => {
    if (selectedCommandId) {
      closeCommand(selectedCommandId, method);
      setSelectedCommandId(null);
    }
  };

  if (!cashier.isOpen) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#2a1f18] rounded-2xl border border-[#3d2b1f] shadow-2xl text-center">
        <div className="w-20 h-20 bg-[#3d2b1f] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={40} className="text-[#8b4513]" />
        </div>
        <h2 className="text-2xl font-bold country-font text-[#d4af37] mb-2">Caixa Fechado</h2>
        <p className="text-[#8b4513] mb-8">Defina o fundo de troco para iniciar as vendas do dia.</p>
        
        <div className="space-y-4">
          <div className="text-left">
            <label className="text-xs font-bold text-[#8b4513] uppercase block mb-1">Saldo Inicial (Troco)</label>
            <input 
              type="number"
              className="w-full bg-[#1a1410] border border-[#3d2b1f] rounded-xl p-4 text-center text-2xl font-bold outline-none focus:border-[#d4af37]"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
            />
          </div>
          <button 
            onClick={() => openCashier(openingBalance)}
            className="w-full bg-[#8b4513] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#a0522d] transition-colors"
          >
            Abrir Caixa Agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Summary */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#2a1f18] p-6 rounded-2xl border border-[#3d2b1f] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Unlock size={80} className="text-[#d4af37]" />
          </div>
          <h3 className="text-sm font-bold text-[#8b4513] uppercase mb-1">Saldo Atual em Caixa</h3>
          <p className="text-4xl font-bold text-white mb-6">R$ {cashier.currentBalance.toFixed(2)}</p>
          
          <div className="space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-[#8b4513]">Fundo de Troco:</span>
                <span className="text-[#f3e5ab]">R$ {cashier.initialBalance.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-[#8b4513]">Entradas Hoje:</span>
                <span className="text-green-400">R$ {(cashier.currentBalance - cashier.initialBalance).toFixed(2)}</span>
             </div>
          </div>

          <button 
            onClick={() => {
                if(window.confirm("Deseja realmente fechar o caixa?")) {
                    closeCashier();
                }
            }}
            className="w-full mt-8 py-3 border border-red-900/50 text-red-400 rounded-xl hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <Lock size={16} />
            <span>Encerrar Turno</span>
          </button>
        </div>

        <div className="bg-[#2a1f18] rounded-2xl border border-[#3d2b1f] overflow-hidden">
           <div className="p-4 border-b border-[#3d2b1f] flex justify-between items-center">
              <h4 className="font-bold text-[#d4af37]">Últimos Pagamentos</h4>
           </div>
           <div className="max-h-64 overflow-y-auto">
              {cashier.transactions.length === 0 ? (
                <div className="p-8 text-center text-[#3d2b1f] text-sm italic">
                  Nenhuma venda registrada ainda.
                </div>
              ) : (
                cashier.transactions.slice().reverse().map(t => (
                  <div key={t.id} className="p-4 border-b border-[#3d2b1f] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#3d2b1f] p-2 rounded-lg">
                        {t.method === 'cash' ? <Banknote size={16} className="text-green-400" /> : 
                         t.method === 'card' ? <CreditCard size={16} className="text-blue-400" /> : 
                         <Zap size={16} className="text-purple-400" />}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-[#f3e5ab]">Venda Realizada</p>
                        <p className="text-[#8b4513]">{new Date(t.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <span className="font-bold text-white">R$ {t.amount.toFixed(2)}</span>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>

      {/* Right: Checkout */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold country-font text-[#d4af37]">Acerto de Contas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#8b4513] uppercase tracking-widest">Selecione uma Comanda Aberta</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                 {openCommands.map(cmd => (
                    <button 
                      key={cmd.id}
                      onClick={() => setSelectedCommandId(cmd.id)}
                      className={`
                        w-full p-4 rounded-xl border flex justify-between items-center transition-all
                        ${selectedCommandId === cmd.id 
                          ? 'bg-[#8b4513] border-[#8b4513] text-white shadow-lg' 
                          : 'bg-[#2a1f18] border-[#3d2b1f] text-[#f3e5ab] hover:border-[#8b4513]'}
                      `}
                    >
                      <div className="text-left">
                         <p className="font-bold">Mesa {cmd.tableNumber}</p>
                         <p className="text-xs opacity-75">{cmd.customerName || 'Cliente'}</p>
                      </div>
                      <span className="font-bold">R$ {cmd.total.toFixed(2)}</span>
                    </button>
                 ))}
                 {openCommands.length === 0 && (
                    <div className="bg-[#2a1f18] p-8 rounded-xl border border-dashed border-[#3d2b1f] text-center text-[#3d2b1f]">
                        Todas as contas estão pagas!
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-[#2a1f18] p-6 rounded-2xl border border-[#3d2b1f] min-h-[400px]">
              {selectedCommand ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center gap-2 text-[#d4af37] mb-4">
                        <ReceiptText size={20} />
                        <h4 className="font-bold">Resumo da Mesa {selectedCommand.tableNumber}</h4>
                     </div>
                     <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedCommand.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs border-b border-[#3d2b1f] pb-1">
                             <span className="text-[#8b4513]">{item.quantity}x {item.name}</span>
                             <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                     </div>
                     <div className="pt-4 border-t border-[#3d2b1f] flex justify-between items-end">
                        <span className="text-sm font-bold text-[#8b4513]">VALOR TOTAL</span>
                        <span className="text-3xl font-bold text-[#d4af37]">R$ {selectedCommand.total.toFixed(2)}</span>
                     </div>
                  </div>

                  <div className="pt-8 space-y-3">
                     <p className="text-[10px] font-bold text-[#8b4513] uppercase text-center mb-2">Forma de Pagamento</p>
                     <div className="grid grid-cols-3 gap-2">
                        <PaymentButton icon={<Banknote />} label="Dinheiro" onClick={() => handleCloseCommand('cash')} />
                        <PaymentButton icon={<CreditCard />} label="Cartão" onClick={() => handleCloseCommand('card')} />
                        <PaymentButton icon={<Zap />} label="Pix" onClick={() => handleCloseCommand('pix')} />
                     </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                   <div className="w-16 h-16 bg-[#3d2b1f] rounded-full flex items-center justify-center">
                      <AlertCircle size={32} className="text-[#8b4513]" />
                   </div>
                   <div>
                      <h4 className="font-bold text-[#8b4513]">Nada Selecionado</h4>
                      <p className="text-xs text-[#3d2b1f]">Selecione uma comanda à esquerda para fechar a conta.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const PaymentButton = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-3 bg-[#3d2b1f] hover:bg-[#8b4513] text-[#d4af37] hover:text-white rounded-xl transition-all shadow-md group"
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-bold uppercase">{label}</span>
  </button>
);

export default CashierPanel;
