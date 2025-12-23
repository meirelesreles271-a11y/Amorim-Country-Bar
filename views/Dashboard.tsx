
import React from 'react';
import { AppState } from '../types';
import { 
  Users, 
  DollarSign, 
  Beer, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const openCommands = state.commands.filter(c => c.status === 'open');
  const dailyTotal = state.cashier.transactions.reduce((acc, t) => acc + t.amount, 0);
  
  // Fake data for charts
  const salesData = [
    { name: '18h', sales: 400 },
    { name: '19h', sales: 700 },
    { name: '20h', sales: 1200 },
    { name: '21h', sales: 1500 },
    { name: '22h', sales: 1300 },
    { name: '23h', sales: 1800 },
    { name: '00h', sales: 900 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold country-font text-[#d4af37]">Visão Geral</h2>
          <p className="text-[#8b4513]">Como está o rancho hoje?</p>
        </div>
        <div className="bg-[#2a1f18] px-4 py-2 rounded-lg border border-[#3d2b1f] flex items-center gap-2">
            <Clock size={16} className="text-[#d4af37]" />
            <span className="text-sm">Última atualização: Agora mesmo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Comandas Abertas" 
          value={openCommands.length.toString()} 
          icon={<Beer className="text-orange-400" />} 
          sub="Atendimento ativo"
        />
        <StatCard 
          label="Vendas Hoje" 
          value={`R$ ${dailyTotal.toFixed(2)}`} 
          icon={<DollarSign className="text-green-400" />} 
          sub="+12% que ontem"
        />
        <StatCard 
          label="Clientes" 
          value="42" 
          icon={<Users className="text-blue-400" />} 
          sub="Estimado no local"
        />
        <StatCard 
          label="Taxa de Ocupação" 
          value="85%" 
          icon={<TrendingUp className="text-purple-400" />} 
          sub="Mesas ocupadas"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#2a1f18] p-6 rounded-xl border border-[#3d2b1f]">
          <h3 className="text-xl font-bold mb-6 country-font">Movimento por Hora</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d2b1f" />
                <XAxis dataKey="name" stroke="#f3e5ab" />
                <YAxis stroke="#f3e5ab" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a1f18', borderColor: '#3d2b1f', color: '#f3e5ab' }}
                  itemStyle={{ color: '#d4af37' }}
                />
                <Bar dataKey="sales" fill="#8b4513" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#2a1f18] p-6 rounded-xl border border-[#3d2b1f]">
          <h3 className="text-xl font-bold mb-6 country-font">Fluxo de Caixa</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3d2b1f" />
                <XAxis dataKey="name" stroke="#f3e5ab" />
                <YAxis stroke="#f3e5ab" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#2a1f18', borderColor: '#3d2b1f', color: '#f3e5ab' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={3} dot={{ fill: '#d4af37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#2a1f18] rounded-xl border border-[#3d2b1f] overflow-hidden">
        <div className="p-6 border-b border-[#3d2b1f]">
            <h3 className="text-xl font-bold country-font">Comandas Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#3d2b1f] text-[#d4af37] text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Mesa</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3d2b1f]">
              {state.commands.slice(-5).reverse().map((cmd) => (
                <tr key={cmd.id} className="hover:bg-[#3d2b1f]/50 transition-colors">
                  <td className="px-6 py-4 font-bold">Mesa {cmd.tableNumber}</td>
                  <td className="px-6 py-4">{cmd.customerName || 'N/A'}</td>
                  <td className="px-6 py-4 text-[#d4af37]">R$ {cmd.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      cmd.status === 'open' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {cmd.status === 'open' ? 'Aberta' : 'Paga'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-400 hover:underline">Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Fix: Change subText to sub in the prop type definition to match component usage and StatCard calls
const StatCard = ({ label, value, icon, sub }: { label: string, value: string, icon: React.ReactNode, sub?: string }) => (
  <div className="bg-[#2a1f18] p-6 rounded-xl border border-[#3d2b1f] flex items-start justify-between shadow-lg">
    <div>
      <p className="text-[#8b4513] text-sm font-bold uppercase mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
      <p className="text-xs text-[#5a4230]">{sub}</p>
    </div>
    <div className="bg-[#3d2b1f] p-3 rounded-lg">
      {icon}
    </div>
  </div>
);

export default Dashboard;
