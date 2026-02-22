import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth, Permission, ServiceID } from "@/contexts/AuthContext";

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
