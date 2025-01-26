import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hell FIUCKo Hono!')
})

const port = 3000
console.log(`Server is runnasding on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
