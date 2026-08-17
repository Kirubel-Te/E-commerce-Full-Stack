import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/health', (c) => {
  return c.json({
    status:"ok",
    uptime:process.uptime(),
    timestamp:Date.now()
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
