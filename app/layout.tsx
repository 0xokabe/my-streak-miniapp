// app/layout.tsx
export const metadata = {
  title: 'Streak Check-in',
  description: 'Farcaster Miniapp',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
