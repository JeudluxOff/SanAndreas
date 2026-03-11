import { Router, Response } from 'express';
import { AuthRequest, authMiddleware, requireRole } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

export const casesRouter = Router();

const LEGAL_DATA_PATH = path.resolve(process.cwd(), 'shared', 'legal-data.json');

function readLegalData() {
  if (!fs.existsSync(LEGAL_DATA_PATH)) {
    return { cases: [], documents: [], clients: [] };
  }
  const data = fs.readFileSync(LEGAL_DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

function writeLegalData(data: any) {
  fs.writeFileSync(LEGAL_DATA_PATH, JSON.stringify(data, null, 2));
}

/**
 * GET /api/v2/cases
 * List all cases (with filters)
 */
casesRouter.get('/', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const data = readLegalData();
    let cases = data.cases || [];

    // Filter based on user role
    if (req.user?.role === 'client') {
      cases = cases.filter((c: any) => c.client_id === req.user!.user_id);
    } else if (req.user?.role === 'avocat') {
      cases = cases.filter((c: any) => c.lead_id === req.user!.user_id);
    }

    // Apply query filters
    const { status, type, confidentiality } = req.query;
    if (status) cases = cases.filter((c: any) => c.status === status);
    if (type) cases = cases.filter((c: any) => c.type === type);
    if (confidentiality) cases = cases.filter((c: any) => c.confidentiality === confidentiality);

    res.json({
      data: cases,
      count: cases.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

/**
 * GET /api/v2/cases/:id
 * Get case details
 */
casesRouter.get('/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = readLegalData();
    const caseItem = data.cases?.find((c: any) => c.id === id);

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Check access permissions
    if (req.user?.role === 'client' && caseItem.client_id !== req.user.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      data: caseItem,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

/**
 * POST /api/v2/cases
 * Create new case (admin/avocat only)
 */
casesRouter.post('/', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const { title, description, client_id, type, confidentiality } = req.body;

    if (!title || !client_id) {
      return res.status(400).json({ error: 'Title and client_id are required' });
    }

    const data = readLegalData();
    const newCase = {
      id: `HC-2024-${data.cases.length + 1}`,
      title,
      description,
      client_id,
      type: type || 'Pénal',
      status: 'En cours',
      confidentiality: confidentiality || 'Normal',
      lead_id: req.user!.user_id,
      members: [{ user_id: req.user!.user_id, name: req.user!.name, role: req.user!.role, avatar: req.user!.user_id }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    data.cases.push(newCase);
    writeLegalData(data);

    res.status(201).json({
      data: newCase,
      message: 'Case created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create case' });
  }
});

/**
 * PUT /api/v2/cases/:id
 * Update case (admin/case lead only)
 */
casesRouter.put('/:id', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, confidentiality } = req.body;

    const data = readLegalData();
    const caseIndex = data.cases?.findIndex((c: any) => c.id === id);

    if (caseIndex === -1 || caseIndex === undefined) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const caseItem = data.cases[caseIndex];

    // Check if user is lead or admin
    if (req.user?.role !== 'admin' && caseItem.lead_id !== req.user?.user_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields
    if (title) caseItem.title = title;
    if (description) caseItem.description = description;
    if (status) caseItem.status = status;
    if (confidentiality) caseItem.confidentiality = confidentiality;
    caseItem.updated_at = new Date().toISOString();

    writeLegalData(data);

    res.json({
      data: caseItem,
      message: 'Case updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update case' });
  }
});

/**
 * DELETE /api/v2/cases/:id
 * Delete case (admin only)
 */
casesRouter.delete('/:id', authMiddleware, requireRole('admin'), (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = readLegalData();
    const caseIndex = data.cases?.findIndex((c: any) => c.id === id);

    if (caseIndex === -1 || caseIndex === undefined) {
      return res.status(404).json({ error: 'Case not found' });
    }

    data.cases.splice(caseIndex, 1);
    writeLegalData(data);

    res.json({
      message: 'Case deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete case' });
  }
});
