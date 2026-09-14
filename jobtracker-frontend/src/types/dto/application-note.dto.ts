import { NoteType } from '../enums/note-type.enum';

export interface ApplicationNoteDTO {
  id: number;
  jobApplicationId: number;
  type: NoteType;
  content: string;
}

export interface CreateApplicationNoteDTO {
  jobApplicationId: number;
  type: NoteType;
  content: string;
}

export interface UpdateApplicationNoteDTO {
  id: number;
  jobApplicationId: number;
  type: NoteType;
  content: string;
}