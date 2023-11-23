import { ServerWebSocket } from "bun"
import { Context } from "elysia"
import { WS } from "elysia/dist/ws/types"

interface RouteSchema {
  body?: unknown
  headers?: unknown
  query?: unknown
  params?: unknown
  cookie?: unknown
  response?: unknown
}
interface Route extends RouteSchema {}
export type Open = (ws: ServerWebSocket<{ id: string; data: Context }>) => any
export type Message = (ws: ServerWebSocket<{ id: string; data: Context }>, message: Route["body"]) => any
