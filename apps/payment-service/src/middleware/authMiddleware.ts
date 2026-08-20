import { getAuth } from '@hono/clerk-auth'
import { createMiddleware } from 'hono/factory'
import type {CustomJwtSessionClaims} from "@repo/types"

export const shouldBeAuthenticated = createMiddleware<{ Variables:{ userId: string } }>(async (c,next) => {
    const { userId } = getAuth(c)

  if (!userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  c.set('userId', userId)

  await next()
})
export const shouldBeAdmin = createMiddleware<{ Variables:{ userId: string } }>(async (c,next) => {
    const { userId,sessionClaims } = getAuth(c)

  if (!userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }
  const claims = sessionClaims as CustomJwtSessionClaims
  if(claims.metadata?.role !== "admin"){
    return c.json({
      error: "your not Authorized"
    })
  }

  c.set('userId', userId)

  await next()
})