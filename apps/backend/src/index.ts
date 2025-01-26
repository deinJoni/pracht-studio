import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Agent, Team, Task } from 'shared-types'

const app = new Hono()

// Enable CORS
app.use('/*', cors())

// In-memory storage (replace with proper database in production)
const agents: Agent[] = []
const tools: any[] = []
const tasks: Task[] = []
const teams: Team[] = []

// Agent endpoints
app.post('/agents', async (c) => {
  const body = await c.req.json()
  const agent: Agent = {
    id: crypto.randomUUID(),
    ...body
  }
  agents.push(agent)
  return c.json(agent, 201)
})

app.get('/agents', (c) => {
  return c.json(agents)
})

app.get('/agents/:id', (c) => {
  const agent = agents.find(a => a.id === c.req.param('id'))
  if (!agent) return c.json({ error: 'Agent not found' }, 404)
  return c.json(agent)
})

app.put('/agents/:id', async (c) => {
  const body = await c.req.json()
  const index = agents.findIndex(a => a.id === c.req.param('id'))
  if (index === -1) return c.json({ error: 'Agent not found' }, 404)
  agents[index] = { ...agents[index], ...body }
  return c.json(agents[index])
})

app.delete('/agents/:id', (c) => {
  const index = agents.findIndex(a => a.id === c.req.param('id'))
  if (index === -1) return c.json({ error: 'Agent not found' }, 404)
  agents.splice(index, 1)
  return c.json({ message: 'Agent deleted' })
})

// Tool endpoints
app.post('/tools', async (c) => {
  const body = await c.req.json()
  const tool = {
    id: crypto.randomUUID(),
    ...body
  }
  tools.push(tool)
  return c.json(tool, 201)
})

app.get('/tools', (c) => {
  return c.json(tools)
})

app.get('/tools/:id', (c) => {
  const tool = tools.find(t => t.id === c.req.param('id'))
  if (!tool) return c.json({ error: 'Tool not found' }, 404)
  return c.json(tool)
})

// Task endpoints
app.post('/tasks', async (c) => {
  const body = await c.req.json()
  const task = {
    id: crypto.randomUUID(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...body
  }
  tasks.push(task)
  return c.json(task, 201)
})

app.get('/tasks', (c) => {
  return c.json(tasks)
})

app.get('/tasks/:id', (c) => {
  const task = tasks.find(t => t.id === c.req.param('id'))
  if (!task) return c.json({ error: 'Task not found' }, 404)
  return c.json(task)
})

app.put('/tasks/:id/status', async (c) => {
  const body = await c.req.json()
  const index = tasks.findIndex(t => t.id === c.req.param('id'))
  if (index === -1) return c.json({ error: 'Task not found' }, 404)
  tasks[index] = { ...tasks[index], status: body.status }
  return c.json(tasks[index])
})

// Team endpoints
app.post('/teams', async (c) => {
  const body = await c.req.json()
  const team: Team = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    activeTaskIds: [],
    members: [],
    ...body
  }
  teams.push(team)
  return c.json(team, 201)
})

app.get('/teams', (c) => {
  return c.json(teams)
})

app.get('/teams/:id', (c) => {
  const team = teams.find(t => t.id === c.req.param('id'))
  if (!team) return c.json({ error: 'Team not found' }, 404)
  return c.json(team)
})

app.put('/teams/:id', async (c) => {
  const body = await c.req.json()
  const index = teams.findIndex(t => t.id === c.req.param('id'))
  if (index === -1) return c.json({ error: 'Team not found' }, 404)
  teams[index] = {
    ...teams[index],
    ...body,
    updatedAt: new Date().toISOString()
  }
  return c.json(teams[index])
})

app.delete('/teams/:id', (c) => {
  const index = teams.findIndex(t => t.id === c.req.param('id'))
  if (index === -1) return c.json({ error: 'Team not found' }, 404)
  teams.splice(index, 1)
  return c.json({ message: 'Team deleted' })
})

// Team member management
app.post('/teams/:id/members', async (c) => {
  const teamId = c.req.param('id')
  const body = await c.req.json()
  const team = teams.find(t => t.id === teamId)
  if (!team) return c.json({ error: 'Team not found' }, 404)
  
  const member = {
    ...body,
    joinedAt: new Date().toISOString()
  }
  team.members.push(member)
  return c.json(member, 201)
})

app.delete('/teams/:teamId/members/:agentId', (c) => {
  const { teamId, agentId } = c.req.param()
  const team = teams.find(t => t.id === teamId)
  if (!team) return c.json({ error: 'Team not found' }, 404)
  
  const memberIndex = team.members.findIndex(m => m.agentId === agentId)
  if (memberIndex === -1) return c.json({ error: 'Member not found' }, 404)
  
  team.members.splice(memberIndex, 1)
  return c.json({ message: 'Member removed' })
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
