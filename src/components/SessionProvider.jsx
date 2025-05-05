'use client' // Marcar como Client Component

import { SessionProvider as Provider } from 'next-auth/react'

export default function SessionProvider({ children, session }) {
  return (
    // El Provider original de next-auth necesita ejecutarse en el cliente
    <Provider session={session}>
      {children}
    </Provider>
  )
} 