import React, { ReactNode, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { useNotification } from '../contexts/NotificationContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, serverError, admin } = useAuth();
  const { addNotification } = useNotification();
  const location = useLocation();
  const notificationShown = useRef(false);

  useEffect(() => {
    // Se o usuário estava autenticado mas perdeu a sessão, mostrar notificação
    if (!loading && !isAuthenticated && !serverError && location.pathname !== '/login' && !notificationShown.current) {
      addNotification({
        type: 'warning',
        title: 'Sessão Expirada',
        message: 'Sua sessão expirou. Faça login novamente.'
      });
      notificationShown.current = true;
    }

    // Reset the flag when user becomes authenticated again
    if (isAuthenticated) {
      notificationShown.current = false;
    }
  }, [isAuthenticated, loading, serverError, location.pathname, addNotification]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Se houver erro de servidor, redirecionar para login que mostrará a tela de erro
  if (serverError) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};