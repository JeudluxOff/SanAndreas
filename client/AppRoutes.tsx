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
import { ProtectedRoute, PermissionRoute, GovernmentIntranetRoute, MdtRoute } from "@/components/RouteGuards";
import { MdtLayout } from "@/components/MdtLayout";

// MDT pages
import MdtBureau from "@/pages/mdt/Bureau";
import MdtDispatch from "@/pages/mdt/Dispatch";
import MdtUnits from "@/pages/mdt/Units";
import MdtHotspots from "@/pages/mdt/Hotspots";
import MdtEffectifs from "@/pages/mdt/Effectifs";
import MdtCitizens from "@/pages/mdt/Citizens";
import MdtVehicles from "@/pages/mdt/Vehicles";
import MdtProperties from "@/pages/mdt/Properties";
import MdtWeapons from "@/pages/mdt/Weapons";
import MdtReports from "@/pages/mdt/Reports";
import MdtFines from "@/pages/mdt/Fines";
import MdtInvestigations from "@/pages/mdt/Investigations";
import MdtShootingReports from "@/pages/mdt/ShootingReports";
import MdtWarrants from "@/pages/mdt/Warrants";
import MdtBallistics from "@/pages/mdt/Ballistics";
import MdtLab from "@/pages/mdt/Lab";
import MdtSeizures from "@/pages/mdt/Seizures";
import MdtVehicleSeizures from "@/pages/mdt/VehicleSeizures";
import MdtBolo from "@/pages/mdt/Bolo";
import MdtGangs from "@/pages/mdt/Gangs";
import MdtEvidence from "@/pages/mdt/Evidence";
import MdtAnnouncements from "@/pages/mdt/Announcements";
import MdtBracelets from "@/pages/mdt/Bracelets";
import MdtComplaints from "@/pages/mdt/Complaints";
import MdtDepositions from "@/pages/mdt/Depositions";
import MdtPenalCode from "@/pages/mdt/PenalCode";
import MdtServiceHours from "@/pages/mdt/ServiceHours";
import MdtSettings from "@/pages/mdt/Settings";
import MdtArrestDossiers from "@/pages/mdt/ArrestDossiers";

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

    {/* MDT Routes */}
    <Route
      path="/mdt/*"
      element={
        <MdtRoute>
          <MdtLayout>
            <Routes>
              <Route path="/" element={<MdtBureau />} />
              <Route path="/dispatch" element={<MdtDispatch />} />
              <Route path="/units" element={<MdtUnits />} />
              <Route path="/hotspots" element={<MdtHotspots />} />
              <Route path="/effectifs" element={<MdtEffectifs />} />
              <Route path="/citizens" element={<MdtCitizens />} />
              <Route path="/vehicles" element={<MdtVehicles />} />
              <Route path="/properties" element={<MdtProperties />} />
              <Route path="/weapons" element={<MdtWeapons />} />
              <Route path="/reports" element={<MdtReports />} />
              <Route path="/fines" element={<MdtFines />} />
              <Route path="/investigations" element={<MdtInvestigations />} />
              <Route path="/shooting-reports" element={<MdtShootingReports />} />
              <Route path="/warrants" element={<MdtWarrants />} />
              <Route path="/ballistics" element={<MdtBallistics />} />
              <Route path="/lab" element={<MdtLab />} />
              <Route path="/seizures" element={<MdtSeizures />} />
              <Route path="/vehicle-seizures" element={<MdtVehicleSeizures />} />
              <Route path="/bolo" element={<MdtBolo />} />
              <Route path="/gangs" element={<MdtGangs />} />
              <Route path="/evidence" element={<MdtEvidence />} />
              <Route path="/announcements" element={<MdtAnnouncements />} />
              <Route path="/bracelets" element={<MdtBracelets />} />
              <Route path="/complaints" element={<MdtComplaints />} />
              <Route path="/depositions" element={<MdtDepositions />} />
              <Route path="/penal-code" element={<MdtPenalCode />} />
              <Route path="/service-hours" element={<MdtServiceHours />} />
              <Route path="/arrest-dossiers" element={<MdtArrestDossiers />} />
              <Route path="/settings" element={<MdtSettings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MdtLayout>
        </MdtRoute>
      }
    />

    {/* Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);
