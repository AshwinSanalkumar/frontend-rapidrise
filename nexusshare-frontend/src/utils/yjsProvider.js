import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

export const createYjsProvider = (workstationId, token) => {
  const ydoc = new Y.Doc()

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const baseUrl = `${protocol}//${window.location.hostname}:8000/ws/workstation`;

  const provider = new WebsocketProvider(
    baseUrl,
    workstationId,
    ydoc,
    {
      connect: true,
      params: token ? { token } : {}
    }
  )

  // ✅ ADD THIS DEBUG
  provider.on('status', event => {
    console.log('WS STATUS:', event.status)
  })

  provider.on('sync', isSynced => {
    console.log('SYNC STATUS:', isSynced)
  })

  return { ydoc, provider }
}