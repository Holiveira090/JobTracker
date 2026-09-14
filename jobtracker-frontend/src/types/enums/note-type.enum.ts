export const NoteType = {
  CHALLENGE: 'CHALLENGE',
  QUESTION: 'QUESTION',
  GENERAL: 'GENERAL',
} as const;

export type NoteType = typeof NoteType[keyof typeof NoteType];

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  [NoteType.CHALLENGE]: 'Desafio',
  [NoteType.QUESTION]: 'Pergunta',
  [NoteType.GENERAL]: 'Geral',
};

export const NOTE_TYPE_COLORS: Record<NoteType, string> = {
  [NoteType.CHALLENGE]: 'bg-orange-100 text-orange-800 border-orange-300',
  [NoteType.QUESTION]: 'bg-blue-100 text-blue-800 border-blue-300',
  [NoteType.GENERAL]: 'bg-gray-100 text-gray-800 border-gray-300',
};