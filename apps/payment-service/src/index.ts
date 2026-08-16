import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
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
