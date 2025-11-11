'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './header.module.css';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const fecharMenu = () => {
    setMenuAberto(false);
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <Link href="/" legacyBehavior>
            <a className={styles.logo}>Bolos da Adê</a>
          </Link>

          {/* Menu Desktop */}
          <div className={styles.menuDesktop}>
            <Link href="#cardapio" legacyBehavior><a className={styles.navLink}>Cardápio</a></Link>
            <Link href="#sobre" legacyBehavior><a className={styles.navLink}>Quem Somos</a></Link>
            <Link href="#local" legacyBehavior><a className={styles.navLink}>Localização</a></Link>
          </div>

          {/* Botão Mobile */}
          <div className={styles.btnContainerMobile}>
            <button
              className={styles.btnMobile}
              onClick={toggleMenu}
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
            >
              {/* Ícone Hamburger */}
              <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile (Oculto) */}
        {menuAberto && (
          <div className={styles.menuMobile}>
            <Link href="#cardapio" legacyBehavior><a className={styles.navLinkMobile} onClick={fecharMenu}>Cardápio</a></Link>
            <Link href="#sobre" legacyBehavior><a className={styles.navLinkMobile} onClick={fecharMenu}>Quem Somos</a></Link>
            <Link href="#local" legacyBehavior><a className={styles.navLinkMobile} onClick={fecharMenu}>Localização</a></Link>
          </div>
        )}
      </nav>
    </header>
  );
}