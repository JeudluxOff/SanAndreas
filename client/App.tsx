import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Gouvernement from "./pages/Gouvernement";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Dashboard from "./pages/intranet/Dashboard";
import Documents from "./pages/intranet/Documents";
import Dossiers from "./pages/intranet/Dossiers";
import DossierDetail from "./pages/intranet/DossierDetail";
import Workspace from "./pages/intranet/Workspace";
import HR from "./pages/intranet/HR";
import AuditLogs from "./pages/intranet/AuditLogs";
import Communication from "./pages/intranet/Communication";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-bold">Chargement du système gouvernemental...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/gouvernement" element={<Gouvernement />} />
    <Route path="/securite" element={<Placeholder />} />
    <Route path="/justice" element={<Placeholder />} />
    <Route path="/economie" element={<Placeholder />} />
    <Route path="/sante" element={<Placeholder />} />
    <Route path="/services" element={<Services />} />
    <Route path="/login" element={<Login />} />

    {/* Intranet Protected Routes */}
    <Route 
      path="/intranet/*" 
      element={
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/dossiers" element={<Dossiers />} />
            <Route path="/dossiers/:id" element={<DossierDetail />} />
            <Route path="/workspace/:serviceId" element={<Workspace />} />
            <Route path="/workspaces" element={<Placeholder title="Espaces de Travail" />} />
            <Route path="/calendar" element={<Placeholder title="Planning & Réunions" />} />
            <Route path="/logs" element={<AuditLogs />} />
            <Route path="/hr" element={<HR />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedRoute>
      } 
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
