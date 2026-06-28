import React from "react";
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Cabinet from "@/pages/Cabinet";
import LegalDashboard from "@/pages/cabinet/Dashboard";
import LegalDossiers from "@/pages/cabinet/Dossiers";
import LegalDossierDetail from "@/pages/cabinet/DossierDetail";
import LegalPortal from "@/pages/cabinet/Portal";
import LegalBilling from "@/pages/cabinet/Billing";
import LegalAudit from "@/pages/cabinet/Audit";
import LegalDocuments from "@/pages/cabinet/Documents";
import LegalArchives from "@/pages/cabinet/Archives";
import LegalEvidence from "@/pages/cabinet/Evidence";
import LegalPlanning from "@/pages/cabinet/Planning";
import LegalTasks from "@/pages/cabinet/Tasks";
import LegalCommunication from "@/pages/cabinet/Communication";
import LegalClients from "@/pages/cabinet/Clients";
import LegalAdmin from "@/pages/cabinet/Admin";
import LegalWorkspaces from "@/pages/cabinet/Workspaces";
import CabinetLogin from "@/pages/cabinet/Login";
import ClientLogin from "@/pages/cabinet/ClientLogin";
import CriminalLaw from "@/pages/cabinet/public/CriminalLaw";
import CivilLaw from "@/pages/cabinet/public/CivilLaw";
import BusinessLaw from "@/pages/cabinet/public/BusinessLaw";
import AdministrativeLaw from "@/pages/cabinet/public/AdministrativeLaw";
import Methodology from "@/pages/cabinet/public/Methodology";
import Fees from "@/pages/cabinet/public/Fees";
import NotFound from "@/pages/NotFound";
import Placeholder from "@/pages/Placeholder";
import Governance from "@/pages/Gouvernement";
import Security from "@/pages/Security";
import Justice from "@/pages/Justice";
import Economy from "@/pages/Economy";
import Health from "@/pages/Health";
import Services from "@/pages/Services";
import Login from "@/pages/Login";
import Dashboard from "@/pages/intranet/Dashboard";
import Documents from "@/pages/intranet/Documents";
import Dossiers from "@/pages/intranet/Dossiers";
import DossierDetail from "@/pages/intranet/DossierDetail";
import Workspace from "@/pages/intranet/Workspace";
import Workspaces from "@/pages/intranet/Workspaces";
import Calendar from "@/pages/intranet/Calendar";
import HR from "@/pages/intranet/HR";
import EmployeeDetail from "@/pages/intranet/EmployeeDetail";
import AuditLogs from "@/pages/intranet/AuditLogs";
import Communication from "@/pages/intranet/Communication";
import LegalIntranetLayout from "@/pages/cabinet/intranet/LegalIntranetLayout";
import AdminPublish from "@/pages/AdminPublish";
import { ProtectedRoute, PermissionRoute, GovernmentIntranetRoute } from "@/components/RouteGuards";

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Index />} />
    <Route path="/cabinet" element={<Cabinet />} />
    <Route path="/cabinet/criminal-law" element={<CriminalLaw />} />
    <Route path="/cabinet/civil-law" element={<CivilLaw />} />
    <Route path="/cabinet/business-law" element={<BusinessLaw />} />
    <Route path="/cabinet/administrative-law" element={<AdministrativeLaw />} />
    <Route path="/cabinet/methodology" element={<Methodology />} />
    <Route path="/cabinet/fees" element={<Fees />} />
    <Route path="/cabinet/login" element={<CabinetLogin />} />
    <Route path="/cabinet/client-login" element={<ClientLogin />} />
    <Route path="/cabinet/portal" element={
      <ProtectedRoute>
        <LegalPortal />
      </ProtectedRoute>
    } />
    <Route path="/cabinet/intranet/*" element={
      <PermissionRoute permission="lawyer:intranet_access">
        <LegalIntranetLayout>
          <Routes>
            <Route path="/" element={<LegalDashboard />} />
            <Route path="/dossiers" element={<LegalDossiers />} />
            <Route path="/archives" element={<LegalArchives />} />
            <Route path="/dossiers/:id" element={<LegalDossierDetail />} />
            <Route path="/documents" element={<LegalDocuments />} />
            <Route path="/evidence" element={<LegalEvidence />} />
            <Route path="/planning" element={<LegalPlanning />} />
            <Route path="/billing" element={<LegalBilling />} />
            <Route path="/communication" element={<LegalCommunication />} />
            <Route path="/clients" element={<LegalClients />} />
            <Route path="/workspaces" element={<LegalWorkspaces />} />
            <Route path="/tasks" element={<LegalTasks />} />
            <Route path="/audit" element={<LegalAudit />} />
            <Route path="/admin" element={<LegalAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LegalIntranetLayout>
      </PermissionRoute>
    } />
    <Route path="/gouvernement" element={<Governance />} />
    <Route path="/securite" element={<Security />} />
    <Route path="/justice" element={<Justice />} />
    <Route path="/economie" element={<Economy />} />
    <Route path="/sante" element={<Health />} />
    <Route path="/services" element={<Services />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin/publish" element={
      <ProtectedRoute>
        <AdminPublish />
      </ProtectedRoute>
    } />

    {/* Intranet Protected Routes */}
    <Route
      path="/intranet/*"
      element={
        <ProtectedRoute>
          <GovernmentIntranetRoute>
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
              <Route path="/hr/:employeeId" element={<EmployeeDetail />} />
              <Route path="/communication" element={<Communication />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GovernmentIntranetRoute>
        </ProtectedRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
