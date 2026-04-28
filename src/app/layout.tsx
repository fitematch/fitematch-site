import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FlashMessage } from '@/components/ui/flash-message';
import { FlashMessageProvider } from '@/contexts/flash-message-context';
import { AuthProvider } from '@/contexts/auth-context';
import { PAGE_STYLES } from '@/constants/styles';

export const metadata: Metadata = {
  title: 'fitematch',
  description: 'Vagas para profissionais de educação física.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={PAGE_STYLES.body}>
        <FlashMessageProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <FlashMessage />
          </AuthProvider>
        </FlashMessageProvider>
      </body>
    </html>
  );
}
