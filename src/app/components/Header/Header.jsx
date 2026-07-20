'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './header.module.css';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const { cart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantidade, 0);
  
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
          <Link href="/" className={styles.logo}>
            Bolos da Adê
          </Link>

          {/* Menu Desktop */}
          <div className={styles.menuDesktop}>
            <Link href="#cardapio" className={styles.navLink}>Cardápio</Link>
            <Link href="#sobre" className={styles.navLink}>Quem Somos</Link>
            <Link href="#local" className={styles.navLink}>Localização</Link>
          </div>
          
          {/* Botão Mobile */}
          
            <Link href="/carrinho" className={styles.cartIconWrapper}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={styles.cartIcon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            
            {/* Badge de notificação (só aparece se tiver itens) */}
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>

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
            <Link href="#cardapio" className={styles.navLinkMobile} onClick={fecharMenu}>Cardápio</Link>
            <Link href="#sobre" className={styles.navLinkMobile} onClick={fecharMenu}>Quem Somos</Link>
            <Link href="#local" className={styles.navLinkMobile} onClick={fecharMenu}>Localização</Link>
          </div>
        )}
      </nav>
    </header>
  );
}