import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  LayoutDashboard, 
  Users, 
  Play, 
  Server, 
  Settings, 
  LogOut, 
  BellRing,
  FileText,
  Shield,
  CreditCard,
  AlertTriangle
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { admin, logout, serverError, checkServerHealth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, redirecionar para login
      navigate('/login');
    }
  };

  const handleRetryConnection = async () => {
    try {
      const healthy = await checkServerHealth();
      if (healthy) {
        addNotification({
          type: 'success',
          title: 'Conexão Restaurada',
          message: 'Servidor está disponível novamente.'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Não foi possível verificar o status do servidor.'
      });
    }
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/revendas', icon: Users, label: 'Revendas' },
    { path: '/streamings', icon: Play, label: 'Streamings' },
    { path: '/servidores', icon: Server, label: 'Servidores' },
    { path: '/planos-streaming', icon: CreditCard, label: 'Planos Streaming' },
    { path: '/planos-revenda', icon: CreditCard, label: 'Planos Revenda' },
    { path: '/administradores', icon: Shield, label: 'Administradores' },
    { path: '/perfis', icon: Users, label: 'Perfis de Acesso' },
    { path: '/logs', icon: FileText, label: 'Logs' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Server Error Banner */}
      {serverError && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">
                Servidor indisponível. Algumas funcionalidades podem não funcionar.
              </span>
            </div>
            <button
              onClick={handleRetryConnection}
              className="text-sm underline hover:no-underline"
            >
              Tentar reconectar
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white shadow-lg ${serverError ? 'mt-10' : ''}`}>
        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white rounded-xl p-2 shadow-lg">
              <img 
                src="./logo.png" 
                alt="Logo" 
                className="h-8 w-auto"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">SamCast</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm font-medium text-gray-800">
              Olá, {admin?.nome || 'Usuário'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {admin?.nivel_acesso === 'super_admin' ? 'Super Administrador' : 
               admin?.nivel_acesso === 'admin' ? 'Administrador' : 'Suporte'}
            </p>
          </div>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${serverError ? 'mt-10' : ''}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Painel'}
            </h2>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BellRing className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{admin?.nome}</p>
                  <p className="text-xs text-gray-500">{admin?.nivel_acesso}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};