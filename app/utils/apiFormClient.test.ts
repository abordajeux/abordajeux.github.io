import { describe, expect, it } from 'vitest'
import { genericFormError, mapApiFormError } from './apiFormClient'

describe('mapApiFormError', () => {
  it('returns the API message from a fetch-like error body', () => {
    const err = {
      data: {
        status: 'rate_limited',
        message: 'Trop de tentatives. Veuillez patienter quelques secondes avant de réessayer.',
      },
    }

    expect(mapApiFormError(err)).toBe('Trop de tentatives. Veuillez patienter quelques secondes avant de réessayer.')
  })

  it('returns the API invalid-email message', () => {
    const err = {
      data: {
        status: 'invalid_email',
        message: 'Le domaine de votre adresse email semble invalide. Vérifiez votre saisie.',
      },
    }

    expect(mapApiFormError(err)).toBe('Le domaine de votre adresse email semble invalide. Vérifiez votre saisie.')
  })

  it('falls back to the generic message when the body has no message', () => {
    const err = { data: { detail: [{ loc: ['body', 'sender_email'] }] } }

    expect(mapApiFormError(err)).toBe(genericFormError)
  })

  it('falls back when the message is empty or not a string', () => {
    expect(mapApiFormError({ data: { message: '' } })).toBe(genericFormError)
    expect(mapApiFormError({ data: { message: 42 } })).toBe(genericFormError)
  })

  it('falls back on network errors without a response body', () => {
    expect(mapApiFormError(new TypeError('Failed to fetch'))).toBe(genericFormError)
    expect(mapApiFormError({ data: null })).toBe(genericFormError)
    expect(mapApiFormError(null)).toBe(genericFormError)
    expect(mapApiFormError('boom')).toBe(genericFormError)
  })
})
