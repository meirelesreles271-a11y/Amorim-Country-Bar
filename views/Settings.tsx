
import React from 'react';
import { 
  QrCode, 
  Palette, 
  Smartphone, 
  Database,
  Info,
  ExternalLink
} from 'lucide-react';

const Settings: React.FC = () => {
  // Generate the current URL for the digital menu
  const menuUrl = `${window.location.origin}${window.location.pathname}#/menu`;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl font-bold country-font text-[#d4af37]">Configurações</h2>
        <p className="text-[#8b4513]">Ajuste as ferraduras do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* QR Code Section */}
        <div className="bg-[#2a1f18] p-8 rounded-2xl border border-[#3d2b1f] space-y-6">
          <div className="flex items-center gap-3 text-[#d4af37]">
            <QrCode size={24} />
            <h3 className="text-xl font-bold country-font">Menu Digital QR Code</h3>
          </div>
          <p className="text-sm text-[#8b4513]">
            Imprima este QR Code e coloque nas mesas para que seus clientes acessem o menu diretamente pelo celular.
          </p>
          
          <div className="bg-white p-6 rounded-2xl w-fit mx-auto shadow-2xl">
             {/* Using a simple placeholder for QR since we don't have a library in the template rules, 
                 but in a real environment we'd use 'react-qr-code' */}
             <div className="w-48 h-48 bg-gray-100 border-4 border-[#8b4513] flex flex-col items-center justify-center p-2">
                <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}')] bg-cover" />
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
             <label className="text-[10px] font-bold text-[#8b4513] uppercase">Link do Menu</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={menuUrl}
                  className="flex-1 bg-[#1a1410] border border-[#3d2b1f] rounded-lg px-4 py-2 text-xs text-[#8b4513]"
                />
                <button 
                  onClick={() => window.open(menuUrl, '_blank')}
                  className="bg-[#3d2b1f] p-2 rounded-lg text-[#d4af37] hover:bg-[#8b4513] hover:text-white transition-all"
                >
                  <ExternalLink size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="space-y-6">
          <SettingsGroup 
            icon={<Palette className="text-pink-400" />}
            title="Aparência do Bar"
            description="Mude as cores, fontes e logo do seu sistema country."
          />
          <SettingsGroup 
            icon={<Smartphone className="text-blue-400" />}
            title="Sincronização Mobile"
            description="Configure o acesso para tablets e celulares da equipe."
          />
          <SettingsGroup 
            icon={<Database className="text-green-400" />}
            title="Backup e Dados"
            description="Exporte o histórico de vendas e estoque em formato CSV."
          />
          <SettingsGroup 
            icon={<Info className="text-purple-400" />}
            title="Sobre o Sistema"
            description="Versão 1.2.4 - Amorim Country Bar PDV Pro"
          />
        </div>
      </div>
    </div>
  );
};

const SettingsGroup = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-[#2a1f18] p-6 rounded-2xl border border-[#3d2b1f] flex gap-4 hover:bg-[#3d2b1f]/30 cursor-pointer transition-all group">
    <div className="w-12 h-12 bg-[#3d2b1f] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-[#f3e5ab] mb-1">{title}</h4>
      <p className="text-xs text-[#8b4513]">{description}</p>
    </div>
  </div>
);

export default Settings;
