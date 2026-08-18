import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeAuthenticated } from './middleware/authMiddleware.js'

const app = new Hono()
app.use('*', clerkMiddleware())

app.get('/health', (c) => {
  return c.json({
    status:"ok",
    uptime:process.uptime(),
    timestamp:Date.now()
  })
})

app.get('/test',shouldBeAuthenticated, (c) => {
  
  const { userId } = getAuth(c)
  return c.json({
    message: 'Payment authenticated!',
    userId
  })
})

const start = async () => {
  try{
    serve({
      fetch: app.fetch,
      port: 8002
    }, (info) => {
      console.log(`Server is running on http://localhost:${info.port}`)
    })
  }catch(err){
    console.error("Error starting server:", err)
    process.exit(1)
  }
}

start()
