export const AuthProvider = {
  CREDENTIALS: 'CREDENTIALS',
  GITHUB: 'GITHUB'
} as const;

export type AuthProvider = typeof AuthProvider[keyof typeof AuthProvider];

export const AUTH_PROVIDER_LABELS: Record<AuthProvider, string> = {
  [AuthProvider.CREDENTIALS]: 'Email/Senha',
  [AuthProvider.GITHUB]: 'GitHub',
}