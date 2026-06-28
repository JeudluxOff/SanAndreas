import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth, Permission, ServiceID } from "@/contexts/AuthContext";
import { Shield, TriangleAlert as AlertTriangle } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Chargement du système gouvernemental...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export const PermissionRoute = ({ children, permission }: { children: React.ReactNode, permission: Permission }) => {
  const { user, hasPermission, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!hasPermission(permission)) return <Navigate to="/intranet" replace />;

  return <>{children}</>;
};

export const GovernmentIntranetRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Chargement du système gouvernemental...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (user.govStatus === 'suspendu' || user.govStatus === 'archive') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Acces Refuse</h1>
          <p className="text-sm text-slate-600 font-medium">
            Votre compte a ete {user.govStatus === 'suspendu' ? 'suspendu' : 'archive'}.
            Contactez le service des Ressources Humaines pour plus d'informations.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Gouvernement de San Andreas</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
