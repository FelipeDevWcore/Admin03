import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Lock, User, Shield, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, serverError, checkServerHealth } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleRetryConnection = async () => {
    setLoading(true);
    try {
      const healthy = await checkServerHealth();
      if (healthy) {
        addNotification({
          type: 'success',
          title: 'Conexão Restaurada',
          message: 'Servidor está disponível novamente.'
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Servidor Indisponível',
          message: 'O servidor ainda não está respondendo. Tente novamente em alguns instantes.'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Não foi possível verificar o status do servidor.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      addNotification({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo ao painel administrativo.'
      });
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: error.message || 'Credenciais inválidas.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Se houver erro de servidor, mostrar tela de erro
  if (serverError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg backdrop-blur-xl bg-white/95 shadow-2xl border-0">
          <div className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="text-red-600" size={48} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Servidor Indisponível
            </h1>
            <p className="text-gray-600 mb-6">
              O servidor não está respondendo. Isso pode acontecer durante manutenções ou atualizações.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={handleRetryConnection}
                disabled={loading}
                className="w-full"
              >
                <RefreshCw size={16} className="mr-2" />
                {loading ? 'Verificando...' : 'Tentar Novamente'}
              </Button>
              <div className="text-sm text-gray-500">
                <p>Se o problema persistir, entre em contato com o suporte técnico.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-bounce delay-1000">
          <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce delay-2000">
          <div className="w-6 h-6 bg-purple-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/2 right-32 animate-bounce">
          <div className="w-3 h-3 bg-indigo-400 rounded-full opacity-60"></div>
        </div>
      </div>
      
      <Card className="w-full max-w-lg backdrop-blur-xl bg-white/95 shadow-2xl border-0 relative z-10 overflow-hidden">
        {/* Decorative Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
        
        <div className="text-center mb-10 pt-8">
          <div className="flex justify-center mb-8 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl">
                <img 
                  src="./logo.png" 
                  alt="SamCast Logo" 
                  className="h-20 w-auto drop-shadow-xl"
                />
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Gerenciamento Administrativo
          </h1>
          <p className="text-gray-600 text-lg font-medium">Painel Administrativo de Streaming</p>
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Shield className="text-gray-400" size={16} />
            <span className="text-sm text-gray-500">Acesso seguro e protegido</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-2">
          <div className="relative">
            <div className="absolute -left-1 top-8 w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              className="pl-14 py-4 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-2xl bg-gray-50/50 backdrop-blur-sm"
            />
            <User className="absolute left-5 top-11 text-purple-400" size={20} />
          </div>

          <div className="relative">
            <div className="absolute -left-1 top-8 w-1 h-12 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full"></div>
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="pl-14 py-4 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-2xl bg-gray-50/50 backdrop-blur-sm"
            />
            <Lock className="absolute left-5 top-11 text-purple-400" size={20} />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !senha}
            className="w-full bg-gradient-to-r from-slate-800 via-purple-600 to-indigo-600 hover:from-slate-900 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl hover:shadow-2xl text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">
            {loading ? 'Entrando...' : 'Entrar'}
            </span>
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full animate-pulse shadow-lg ${serverError ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="font-medium">{serverError ? 'Verificando Servidor...' : 'Sistema Online e Seguro'}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Powered by Wcore Tecnologia
          </div>
        </div>
      </Card>
    </div>
  );
};