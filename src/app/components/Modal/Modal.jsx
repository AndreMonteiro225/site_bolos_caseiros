import Image from 'next/image';
import { useEffect } from 'react';
import { useCart } from '../../context/CartContext'; // <-- Importe o hook do carrinho
import styles from './modal.module.css';

export default function Modal({ bolo, onClose }) {
  const { addToCart } = useCart(); // <-- Puxe a função de adicionar

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!bolo) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.modalContainer} role="dialog" aria-modal="true">
        <div className={styles.modalContent}>
          <div className={styles.layoutGrid}>
            <div className={styles.imageWrapper}>
              <Image src={bolo.img} alt={`Foto do ${bolo.nome}`} width={600} height={600} className={styles.modalImage} />
            </div>

            <div className={styles.detailsWrapper}>
              <h2 className={styles.modalTitle}>{bolo.nome}</h2>
              <hr className={styles.divider} />
              <p className={styles.modalDescription}>{bolo.descricao}</p>
              
              {/* ÁREA DE COMPRA */}
              <div className={styles.purchaseArea}>
                {/* Opção Fatia */}
                <div className={styles.optionBox}>
                  <div>
                    <span className={styles.optionTitle}>Fatia</span>
                    <p className={styles.optionPrice}>{bolo.fatia}</p>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(bolo, 'fatia', bolo.fatia);
                      alert('Fatia adicionada ao carrinho!');
                    }}
                    className={styles.addBtn}
                  >
                    + Adicionar
                  </button>
                </div>

                {/* Opção Bolo Inteiro */}
                <div className={styles.optionBox}>
                  <div>
                    <span className={styles.optionTitle}>Bolo Inteiro</span>
                    <p className={styles.optionPrice}>{bolo.boloInteiro}</p>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart(bolo, 'inteiro', bolo.boloInteiro);
                      alert('Bolo inteiro adicionado ao carrinho!');
                    }}
                    className={styles.addBtn}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal">
          <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </>
  );
}