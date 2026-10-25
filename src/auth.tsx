import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createClient, type User } from '@supabase/supabase-js'
import { setStorageScope } from './storage'

const adminEmail = 'ankurempire008@gmail.com'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null
export const isAuthConfigured = supabase !== null

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  isLoading: boolean
  authError: string
  clearAuthError: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!supabase) {
      setStorageScope(null)
      return undefined
    }

    let isMounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      const nextUser = session?.user ?? null
      setStorageScope(nextUser?.id ?? null)
      setUser(nextUser)
      setIsLoading(false)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return
      if (error) setAuthError(error.message)
      const nextUser = data.session?.user ?? null
      setStorageScope(nextUser?.id ?? null)
      setUser(nextUser)
      setIsLoading(false)
    }).catch((error: unknown) => {
      if (!isMounted) return
      setAuthError(error instanceof Error ? error.message : 'Could not restore your sign-in session.')
      setIsLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAdmin: user?.email?.toLowerCase() === adminEmail && user.app_metadata.role === 'admin',
    isLoading,
    authError,
    clearAuthError: () => setAuthError(''),
    signOut: async () => {
      if (!supabase) return
      const { error } = await supabase.auth.signOut()
      if (error) setAuthError(error.message)
    },
  }), [authError, isLoading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
