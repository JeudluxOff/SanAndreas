import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const clientsRouter = Router();

const LEGAL_DATA_PATH = path.resolve(process.cwd(), 'shared', 'legal-data.json');

function readLegalData() {
  if (!fs.existsSync(LEGAL_DATA_PATH)) {
    return { cases: [], documents: [], invoices: [], clients: [] };
  }
  const data = fs.readFileSync(LEGAL_DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

/**
 * GET /api/v2/clients/:clientId/cases
 * Get all cases for a specific client
 */
clientsRouter.get('/:clientId/cases', (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const data = readLegalData();

    // Filter cases by client_id
    let cases = (data.cases || []).filter((c: any) => c.client_id === clientId);

    // Remove archived cases by default
    const { includeArchived } = req.query;
    if (includeArchived !== 'true') {
      cases = cases.filter((c: any) => c.status !== 'Archivé');
    }

    res.json({
      data: cases,
      count: cases.length,
      clientId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client cases' });
  }
});

/**
 * GET /api/v2/clients/:clientId/documents
 * Get all documents for a client's cases
 */
clientsRouter.get('/:clientId/documents', (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const data = readLegalData();

    // Get client's cases first
    const clientCases = (data.cases || []).filter((c: any) => c.client_id === clientId);
    const caseIds = clientCases.map((c: any) => c.id);

    // Get documents for those cases with visibility level set to 'shared'
    let documents = (data.documents || []).filter((d: any) =>
      caseIds.includes(d.case_id) && (d.visibility_level === 'shared' || !d.visibility_level)
    );

    // Remove archived documents by default
    const { includeArchived } = req.query;
    if (includeArchived !== 'true') {
      documents = documents.filter((d: any) => d.status !== 'Archivé');
    }

    res.json({
      data: documents,
      count: documents.count,
      clientId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client documents' });
  }
});

/**
 * GET /api/v2/clients/:clientId/invoices
 * Get all invoices for a specific client
 */
clientsRouter.get('/:clientId/invoices', (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const data = readLegalData();

    // Filter invoices by client_id
    const invoices = (data.invoices || []).filter((inv: any) => inv.client_id === clientId);

    // Calculate totals
    const totalAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
    const paidAmount = invoices
      .filter((inv: any) => inv.status === 'Payé')
      .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

    res.json({
      data: invoices,
      count: invoices.length,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        paymentPercentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
      },
      clientId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client invoices' });
  }
});

/**
 * GET /api/v2/clients/:clientId/dashboard
 * Get dashboard summary for a client
 */
clientsRouter.get('/:clientId/dashboard', (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const data = readLegalData();

    // Get client info
    const client = (data.clients || []).find((c: any) => c.id === clientId);

    // Get cases
    const cases = (data.cases || []).filter((c: any) => c.client_id === clientId);
    const activeCases = cases.filter((c: any) => c.status !== 'Clos' && c.status !== 'Archivé');

    // Get documents for client's cases
    const caseIds = cases.map((c: any) => c.id);
    const documents = (data.documents || []).filter((d: any) =>
      caseIds.includes(d.case_id) && (d.visibility_level === 'shared' || !d.visibility_level)
    );

    // Get invoices
    const invoices = (data.invoices || []).filter((inv: any) => inv.client_id === clientId);
    const totalAmount = invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
    const paidAmount = invoices
      .filter((inv: any) => inv.status === 'Payé')
      .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

    // Get staff assigned to client's cases
    const assignedStaffIds = activeCases.map((c: any) => c.lead_id);
    const staff = (data.staff || []).filter((s: any) => assignedStaffIds.includes(s.id));

    res.json({
      clientId,
      client,
      caseSummary: {
        total: cases.length,
        active: activeCases.length,
        closed: cases.filter((c: any) => c.status === 'Clos').length,
        archived: cases.filter((c: any) => c.status === 'Archivé').length
      },
      documentCount: documents.length,
      invoiceSummary: {
        total: invoices.length,
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        paymentPercentage: totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
      },
      assignedStaff: staff,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client dashboard' });
  }
});

/**
 * GET /api/v2/clients/:clientId/notifications
 * Get recent activity/notifications for a client
 */
clientsRouter.get('/:clientId/notifications', (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;
    const data = readLegalData();

    // Get recent audit logs related to client's cases
    const clientCases = (data.cases || []).filter((c: any) => c.client_id === clientId);
    const caseIds = clientCases.map((c: any) => c.id);

    const notifications = (data.auditLogs || []).filter((log: any) =>
      caseIds.includes(log.target_id) || log.metadata?.client_id === clientId
    )
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20); // Last 20 events

    res.json({
      data: notifications,
      count: notifications.length,
      clientId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client notifications' });
  }
});
