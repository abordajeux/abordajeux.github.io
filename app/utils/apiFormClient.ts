export const genericFormError = 'Impossible d\'envoyer votre demande pour le moment. Vérifiez votre connexion et réessayez dans un instant.'

export function mapApiFormError(err: unknown): string {
  if (typeof err !== 'object' || err === null) {
    return genericFormError
  }
  const data = (err as { data?: unknown }).data
  if (typeof data !== 'object' || data === null) {
    return genericFormError
  }
  const message = (data as { message?: unknown }).message
  if (typeof message !== 'string' || message.length === 0) {
    return genericFormError
  }
  return message
}
