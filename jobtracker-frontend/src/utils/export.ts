export function exportToCSV(data: string[][], filename: string): void {
  const csvContent = data
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportApplicationsCSV(
  applications: Array<{
    id: number;
    jobTitle: string;
    jobDescription: string | null;
    applicationLink: string | null;
    status: string;
    appliedAt: string;
    companyName?: string;
  }>,
): void {
  const headers = ['ID', 'Cargo', 'Empresa', 'Status', 'Data Candidatura', 'Link'];
  const rows = applications.map((app) => [
    app.id.toString(),
    app.jobTitle,
    app.companyName || '-',
    app.status,
    new Date(app.appliedAt).toLocaleDateString('pt-BR'),
    app.applicationLink || '-',
  ]);

  exportToCSV([headers, ...rows], `candidaturas_${new Date().toISOString().split('T')[0]}.csv`);
}

export function exportContactsCSV(
  contacts: Array<{
    id: number;
    name: string;
    linkedinUrl: string | null;
    notes: string | null;
  }>,
): void {
  const headers = ['ID', 'Nome', 'LinkedIn', 'Observações'];
  const rows = contacts.map((c) => [
    c.id.toString(),
    c.name,
    c.linkedinUrl || '-',
    c.notes || '-',
  ]);

  exportToCSV([headers, ...rows], `contatos_${new Date().toISOString().split('T')[0]}.csv`);
}