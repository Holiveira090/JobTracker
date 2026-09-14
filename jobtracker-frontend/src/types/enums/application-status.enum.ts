export const ApplicationStatus = {
  INTERESTED: 'INTERESTED',
  APPLIED: 'APPLIED',
  INTERVIEWING: 'INTERVIEWING',
  REJECTED: 'REJECTED',
  OFFER: 'OFFER'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.INTERESTED]: 'Interessado',
  [ApplicationStatus.APPLIED]: 'Candidatado',
  [ApplicationStatus.INTERVIEWING]: 'Em Entrevista',
  [ApplicationStatus.REJECTED]: 'Rejeitado',
  [ApplicationStatus.OFFER]: 'Oferta',
}

export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.INTERESTED]: 'bg-sky-100 text-sky-700',
  [ApplicationStatus.APPLIED]: 'bg-slate-100 text-slate-700',
  [ApplicationStatus.INTERVIEWING]: 'bg-amber-100 text-amber-700',
  [ApplicationStatus.REJECTED]: 'bg-rose-100 text-rose-700',
  [ApplicationStatus.OFFER]: 'bg-emerald-100 text-emerald-700',
}

export const APPLICATION_STATUS_DOT_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.INTERESTED]: 'bg-sky-500',
  [ApplicationStatus.APPLIED]: 'bg-slate-500',
  [ApplicationStatus.INTERVIEWING]: 'bg-amber-500',
  [ApplicationStatus.REJECTED]: 'bg-rose-500',
  [ApplicationStatus.OFFER]: 'bg-emerald-500',
}
