import './globals.css'

export const metadata = {
  title: 'MO-211 Simulator',
  description: 'Excel MOS Certification Simulator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative z-10">{children}</body>
    </html>
  )
}
