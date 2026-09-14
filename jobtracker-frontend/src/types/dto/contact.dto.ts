export interface ContactDTO {
  id: number;
  userId: number;
  companyId: number | null;
  name: string;
  linkedinUrl: string | null;
  notes: string | null;
}

export interface CreateContactDTO {
  userId: number;
  companyId?: number | null;
  name: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface UpdateContactDTO {
  id: number;
  userId: number;
  companyId: number | null;
  name: string;
  linkedinUrl: string | null;
  notes: string | null;
}