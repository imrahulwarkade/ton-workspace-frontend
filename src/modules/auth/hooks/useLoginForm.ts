'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage'
import {
  loginSchema,
  type LoginFormValues,
} from '@/modules/auth/schemas/loginSchema'
import { login, loginWithGoogle } from '@/modules/auth/services/authService'

export function useLoginForm() {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [isGooglePending, setIsGooglePending] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: LoginFormValues) {
    setFormError(null)
    try {
      await login(values)
      router.replace('/')
      router.refresh()
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Unable to sign in.'))
    }
  }

  async function onGoogleSignIn() {
    setFormError(null)
    setIsGooglePending(true)
    try {
      await loginWithGoogle()
      router.replace('/')
      router.refresh()
    } catch (error) {
      setFormError(getApiErrorMessage(error, 'Google sign-in is unavailable.'))
    } finally {
      setIsGooglePending(false)
    }
  }

  return {
    form,
    formError,
    isGooglePending,
    onSubmit: form.handleSubmit(onSubmit),
    onGoogleSignIn,
  }
}
