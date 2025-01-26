import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Context, MiddlewareHandler } from 'hono'
import { setCookie } from 'hono/cookie'
import 'dotenv/config'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient<any, 'public', any>
  }
}

export const getSupabase = (c: Context) => {
  return c.get('supabase')
}

export const supabaseMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL missing!')
    }

    if (!supabaseAnonKey) {
      throw new Error('SUPABASE_ANON_KEY missing!')
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(c.req.header('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (!options) {
              setCookie(c, name, value)
              return
            }
            const { domain, expires, httpOnly, maxAge, path, secure, sameSite } = options
            const honoOptions = {
              domain,
              expires,
              httpOnly,
              maxAge,
              path,
              secure,
              sameSite: sameSite === true ? 'Strict' : sameSite === false ? 'None' : sameSite as 'Strict' | 'Lax' | 'None' | undefined
            }
            setCookie(c, name, value, honoOptions)
          })
        },
      },
    })

    c.set('supabase', supabase)

    await next()
  }
}