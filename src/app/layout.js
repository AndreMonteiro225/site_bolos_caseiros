// Este é o novo 'src/app/layout.js'
// Ele substitui o 'pages/_app.js' e define o HTML base.

import { Cormorant_Garamond, Nunito_Sans } from 'next/font/google';
import './globals.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Configuração de fontes (prática recomendada do App Router)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const nunito_sans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito-sans',
});

// Metadados (substitui o <Head> do pages/index.js)
export const metadata = {
  title: 'Bolos da Adê - Premium e Artesanal',
  description: 'Vitrine digital dos bolos artesanais da Adê. Encomende pelo WhatsApp e retire na loja.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${nunito_sans.variable}`}>
      <body>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}