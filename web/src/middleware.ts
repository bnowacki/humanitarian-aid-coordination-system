import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

import { routing } from './i18n/navigation'
import { updateSession } from './lib/supabase/middleware'

const handleI18nRouting = createIntlMiddleware(routing)

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
export async function middleware(req: NextRequest) {
  const res = handleI18nRouting(req)

  return await updateSession(req, res)
}
