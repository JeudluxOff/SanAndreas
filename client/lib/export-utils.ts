/**
 * Export utilities for generating CSV and PDF files
 */

/**
 * Export data to CSV format
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string,
  columns?: string[]
): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]);
  
  // Create header
  const header = cols.join(',');
  
  // Create rows
  const rows = data.map(item =>
    cols.map(col => {
      const value = item[col];
      // Escape quotes and wrap in quotes if contains comma or quote
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? '';
    }).join(',')
  );
  
  // Combine
  const csv = [header, ...rows].join('\n');
  
  // Download
  downloadFile(csv, filename, 'text/csv');
}

/**
 * Export data to JSON format
 */
export function exportToJSON(
  data: any,
  filename: string
): void {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Generate a simple PDF-like report as HTML and print
 * Note: For production, use a library like pdfkit or html2pdf
 */
export function exportToPDF(
  title: string,
  subtitle: string,
  content: string,
  filename: string
): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #1B365D; border-bottom: 3px solid #1B365D; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; border: 1px solid #ddd; }
        td { padding: 10px; border: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9f9f9; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${subtitle ? `<h2>${subtitle}</h2>` : ''}
      ${content}
      <div class="footer">
        <p>Generated on ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  downloadFile(blob, filename, 'application/pdf');
}

/**
 * Download a file to user's computer
 */
function downloadFile(
  content: string | Blob,
  filename: string,
  mimeType: string
): void {
  const blob = typeof content === 'string' 
    ? new Blob([content], { type: mimeType })
    : content;
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Format data for CSV export of cases
 */
export function formatCasesForExport(cases: any[]): Record<string, any>[] {
  return cases.map(c => ({
    'ID': c.id,
    'Titre': c.title,
    'Type': c.type,
    'Statut': c.status,
    'Client': c.client_id,
    'Responsable': c.lead_id,
    'Confidentialité': c.confidentiality,
    'Création': new Date(c.created_at).toLocaleDateString('fr-FR'),
    'Modification': new Date(c.updated_at).toLocaleDateString('fr-FR'),
  }));
}

/**
 * Format data for CSV export of clients
 */
export function formatClientsForExport(clients: any[]): Record<string, any>[] {
  return clients.map(c => ({
    'ID': c.id,
    'Nom': c.name,
    'Type': c.type,
    'Email': c.email || '-',
    'Téléphone': c.phone || '-',
    'Adresse': c.address || '-',
    'Création': new Date(c.created_at).toLocaleDateString('fr-FR'),
  }));
}

/**
 * Format data for CSV export of documents
 */
export function formatDocumentsForExport(documents: any[]): Record<string, any>[] {
  return documents.map(d => ({
    'ID': d.id,
    'Titre': d.title,
    'Dossier': d.case_id,
    'Catégorie': d.category,
    'Statut': d.status,
    'Version': d.current_version,
    'Signé par': d.signatures.length > 0 ? d.signatures.length : 'Non',
    'Création': new Date(d.created_at).toLocaleDateString('fr-FR'),
    'Modification': new Date(d.updated_at).toLocaleDateString('fr-FR'),
  }));
}

/**
 * Format data for CSV export of audit logs
 */
export function formatAuditLogsForExport(logs: any[]): Record<string, any>[] {
  return logs.map(log => ({
    'ID': log.id,
    'Date': new Date(log.timestamp).toLocaleString('fr-FR'),
    'Utilisateur': log.user_name,
    'Action': log.action,
    'Type': log.target_type,
    'Entité ID': log.target_id,
    'Titre/Détail': log.metadata?.title || log.metadata?.name || '-',
  }));
}

/**
 * Generate HTML table for PDF export
 */
export function generateTableHTML(
  data: Record<string, any>[],
  columns?: string[]
): string {
  if (data.length === 0) return '<p>Aucune donnée à afficher</p>';
  
  const cols = columns || Object.keys(data[0]);
  
  const headerRow = `<tr>${cols.map(col => `<th>${col}</th>`).join('')}</tr>`;
  
  const bodyRows = data.map(item =>
    `<tr>${cols.map(col => `<td>${item[col] ?? '-'}</td>`).join('')}</tr>`
  ).join('');
  
  return `<table><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
}
