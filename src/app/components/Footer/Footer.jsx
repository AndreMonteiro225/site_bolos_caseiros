// Este é um novo componente 'src/components/Footer/Footer.js'
// Extraí o footer do 'index.js' para o 'layout.js' poder usá-lo.
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerContainer}`}>
        <p>&copy; 2025 Bolos da Adê. Todos os direitos reservados.</p>
        <p className={styles.footerSubtext}>Feito com ♡ e Next.js</p>
      </div>
    </footer>
  );
}