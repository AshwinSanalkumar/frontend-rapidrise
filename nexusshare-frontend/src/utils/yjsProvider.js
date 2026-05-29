import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export const createYjsProvider = (workstationId, token) => {
  const ydoc = new Y.Doc()

  const baseUrl = import.meta.env.VITE_WS_URL

  const provider = new WebsocketProvider(
    baseUrl,
    workstationId,
    ydoc,
    {
      connect: true,
      params: token ? { token } : {}
    }
  )

  return { ydoc, provider }
}