import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Cabinet from "./pages/Cabinet";
import LegalDashboard from "./pages/cabinet/Dashboard";
import LegalDossiers from "./pages/cabinet/Dossiers";
import LegalPortal from "./pages/cabinet/Portal";
import LegalBilling from "./pages/cabinet/Billing";
import LegalAudit from "./pages/cabinet/Audit";
import LegalDocuments from "./pages/cabinet/Documents";
import LegalEvidence from "./pages/cabinet/Evidence";
import LegalTasks from "./pages/cabinet/Tasks";
import LegalCommunication from "./pages/cabinet/Communication";
import LegalClients from "./pages/cabinet/Clients";
import LegalAdmin from "./pages/cabinet/Admin";
import CabinetLogin from "./pages/cabinet/Login";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Governance from "./pages/Gouvernement";
import Security from "./pages/Security";
import Justice from "./pages/Justice";
import Economy from "./pages/Economy";
import Health from "./pages/Health";
import Services from "./pages/Services";
import Login from "./pages/Login";
import Dashboard from "./pages/intranet/Dashboard";
import Documents from "./pages/intranet/Documents";
import Dossiers from "./pages/intranet/Dossiers";
import DossierDetail from "./pages/intranet/DossierDetail";
import Workspace from "./pages/intranet/Workspace";
import Workspaces from "./pages/intranet/Workspaces";
import Calendar from "./pages/intranet/Calendar";
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
    <Route path="/cabinet" element={<Cabinet />} />
    <Route path="/cabinet/login" element={<CabinetLogin />} />
    <Route path="/cabinet/portal" element={
      <ProtectedRoute>
        <LegalPortal />
      </ProtectedRoute>
    } />
    <Route path="/cabinet/intranet/*" element={
      <ProtectedRoute>
        <Routes>
          <Route path="/" element={<LegalDashboard />} />
          <Route path="/dossiers" element={<LegalDossiers />} />
          <Route path="/documents" element={<LegalDocuments />} />
          <Route path="/evidence" element={<LegalEvidence />} />
          <Route path="/planning" element={<Calendar />} />
          <Route path="/billing" element={<LegalBilling />} />
          <Route path="/communication" element={<LegalCommunication />} />
          <Route path="/clients" element={<LegalClients />} />
          <Route path="/audit" element={<LegalAudit />} />
          <Route path="/admin" element={<LegalAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProtectedRoute>
    } />
    <Route path="/gouvernement" element={<Governance />} />
    <Route path="/securite" element={<Security />} />
    <Route path="/justice" element={<Justice />} />
    <Route path="/economie" element={<Economy />} />
    <Route path="/sante" element={<Health />} />
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
            <Route path="/workspaces" element={<Workspaces />} />
            <Route path="/calendar" element={<Calendar />} />
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
