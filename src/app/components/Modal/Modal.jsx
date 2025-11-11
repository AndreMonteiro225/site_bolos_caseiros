// Este é o arquivo 'components/Modal/Modal.js'
import { useEffect } from 'react';
import Image from 'next/image';
import styles from './modal.module.css';

export default function Modal({ bolo, onClose }) {
  const numeroWhatsApp = '5511999998888'; // Número de telefone da Adê

  // Bloqueia o scroll do body quando o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!bolo) return null;

  const mensagem = `Olá, Adê! Vi o bolo "${bolo.nome}" no site e gostaria de fazer uma encomenda.`;
  const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.modalContainer} role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className={styles.modalContent}>
          <div className={styles.layoutGrid}>
            {/* Imagem */}
            <div className={styles.imageWrapper}>
              <Image
                src={bolo.img}
                alt={`Foto do ${bolo.nome}`}
                width={600}
                height={600}
                className={styles.modalImage}
              />
            </div>

            {/* Detalhes */}
            <div className={styles.detailsWrapper}>
              <h2 id="modal-titulo" className={styles.modalTitle}>{bolo.nome}</h2>
              <p className={styles.modalPrice}>{bolo.preco}</p>
              
              <hr className={styles.divider} />
              
              <p className={styles.modalDescription}>
                {bolo.descricao}
              </p>
              
              <div className={styles.ctaWrapper}>
                <a
                  href={linkWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  Encomendar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Fechar */}
        <button onClick={onClose} className={styles.closeButton} aria-label="Fechar modal">
          <svg className={styles.svgIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </>
  );
}