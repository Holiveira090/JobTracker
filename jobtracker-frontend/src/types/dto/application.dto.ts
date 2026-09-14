import { ApplicationStatus } from '../enums/application-status.enum';

export interface JobApplicationDTO {
  id: number;
  userId: number;
  companyId?: number | null;
  jobTitle: string;
  jobDescription: string;
  applicationLink: string;
  status: ApplicationStatus | null;
  cvVersion: string;
  appliedAt: string;
}

export interface CreateJobApplicationDTO {
  userId: number;
  companyId?: number | null;
  jobTitle: string;
  jobDescription: string;
  applicationLink: string;
  status: ApplicationStatus;
  cvVersion: string;
}

export interface UpdateJobApplicationDTO {
  userId: number;
  companyId?: number | null;
  jobTitle: string;
  jobDescription: string;
  applicationLink: string;
  status: ApplicationStatus;
  cvVersion: string;
}