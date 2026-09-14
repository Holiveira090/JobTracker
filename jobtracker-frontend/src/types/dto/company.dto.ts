export interface CompanyDTO {
  id: number;
  userId: number;
  name: string;
  companyValues: string | null;
  salaryInfoGlassdoor: number | null;
}

export interface CreateCompanyDTO {
  userId: number;
  name: string;
  companyValues?: string | null;
  salaryInfoGlassdoor?: number | null;
}

export interface UpdateCompanyDTO {
  id: number;
  userId: number;
  name: string;
  companyValues?: string | null;
  salaryInfoGlassdoor?: number | null;
}