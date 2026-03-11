import { Router, Response } from 'express';
import { AuthRequest, authMiddleware, requireRole } from '../middleware/auth';
import { AuditReportGenerator } from '../lib/audit-report';
import fs from 'fs';
import path from 'path';

export const auditRouter = Router();

const LEGAL_DATA_PATH = path.resolve(process.cwd(), 'shared', 'legal-data.json');

function readLegalData() {
  if (!fs.existsSync(LEGAL_DATA_PATH)) {
    return { audit_logs: [] };
  }
  const data = fs.readFileSync(LEGAL_DATA_PATH, 'utf-8');
  return JSON.parse(data);
}

/**
 * GET /api/v2/audit/logs
 * Get audit logs with filtering
 */
auditRouter.get('/logs', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const data = readLegalData();
    let logs = data.audit_logs || [];

    // Apply filters
    const { user_id, action, target_type, days } = req.query;

    if (user_id) {
      logs = logs.filter((log: any) => log.user_id === user_id);
    }
    if (action) {
      logs = logs.filter((log: any) => log.action.toLowerCase().includes(action as string));
    }
    if (target_type) {
      logs = logs.filter((log: any) => log.target_type === target_type);
    }

    // Filter by date range (in days)
    if (days) {
      const daysNum = parseInt(days as string);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysNum);

      logs = logs.filter(
        (log: any) => new Date(log.timestamp) >= cutoffDate
      );
    }

    // Sort by timestamp descending
    logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      data: logs,
      count: logs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

/**
 * GET /api/v2/audit/report
 * Generate audit report for a date range
 */
auditRouter.get('/report', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const data = readLegalData();
    const logs = data.audit_logs || [];

    // Parse date range from query
    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() - 30);
          return d;
        })();

    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date();

    const format = (req.query.format as string) || 'json';
    const title = (req.query.title as string) || 'Audit Report';

    // Generate report
    const report = AuditReportGenerator.generateReport(logs, startDate, endDate, title);

    // Set response format
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="audit-report-${report.report_id}.csv"`);
      res.send(AuditReportGenerator.toCSV(report));
    } else if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(AuditReportGenerator.toHTML(report));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(report);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate audit report' });
  }
});

/**
 * GET /api/v2/audit/report/download
 * Download report in specific format
 */
auditRouter.get('/report/download', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const data = readLegalData();
    const logs = data.audit_logs || [];

    const startDate = req.query.start_date
      ? new Date(req.query.start_date as string)
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() - 30);
          return d;
        })();

    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date();
    const format = (req.query.format as string) || 'pdf';
    const title = (req.query.title as string) || 'Audit Report';

    const report = AuditReportGenerator.generateReport(logs, startDate, endDate, title);

    let filename: string;
    let content: string;
    let contentType: string;

    if (format === 'csv') {
      filename = `audit-report-${report.report_id}.csv`;
      content = AuditReportGenerator.toCSV(report);
      contentType = 'text/csv';
    } else if (format === 'json') {
      filename = `audit-report-${report.report_id}.json`;
      content = AuditReportGenerator.toJSON(report);
      contentType = 'application/json';
    } else {
      // HTML/PDF
      filename = `audit-report-${report.report_id}.html`;
      content = AuditReportGenerator.toHTML(report);
      contentType = 'text/html';
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download audit report' });
  }
});

/**
 * GET /api/v2/audit/stats
 * Get audit statistics
 */
auditRouter.get('/stats', authMiddleware, requireRole('admin', 'avocat'), (req: AuthRequest, res: Response) => {
  try {
    const data = readLegalData();
    const logs = data.audit_logs || [];

    // Calculate 30-day stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLogs = logs.filter((log: any) => new Date(log.timestamp) >= thirtyDaysAgo);

    const actionCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};

    recentLogs.forEach((log: any) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
      userCounts[log.user_name] = (userCounts[log.user_name] || 0) + 1;
    });

    res.json({
      data: {
        total_logs: logs.length,
        logs_last_30_days: recentLogs.length,
        actions_by_type: actionCounts,
        actions_by_user: userCounts,
        daily_average: Math.round(recentLogs.length / 30)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit stats' });
  }
});
