import { headers } from 'next/headers';

export default async function ThemeLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const theme = headersList.get('x-theme') || 'light';

  return (
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      {children}
    </html>
  );
} 