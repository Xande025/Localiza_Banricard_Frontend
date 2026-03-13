import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Localiza Banricard - Estabelecimentos que aceitam Banricard Vale Refeição',
  description: 'Encontre restaurantes, postos, farmácias e outros estabelecimentos que aceitam Banricard Vale Refeição no RS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
