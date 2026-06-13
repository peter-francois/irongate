import { Hono } from 'hono'
import metrics from './routes/metrics'

const app = new Hono()

app.route('/metrics', metrics)

export default app
