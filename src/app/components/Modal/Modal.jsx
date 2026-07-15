import Image from 'next/image';
import { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './modal.module.css';

export default function Modal({ bolo, onClose }) {
  // Trazemos as informações necessárias do carrinho
  const { cart, addToCart, updateQuantity } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!bolo) return null;

  // Função auxiliar: Procura no carrinho a quantidade deste bolo no tipo selecionado (fatia ou inteiro)
  const getQuantity = (tipo) => {
    const item = cart.find((i) => i.id === bolo.id && i.tipo === tipo);
    return item ? item.quantidade : 0;
  };

  // Função para lidar com o botão "+"
  const handleIncrease = (tipo, precoString) => {
    const currentQty = getQuantity(tipo);
    if (currentQty === 0) {
      // Se não tem no carrinho, adiciona o primeiro
      addToCart(bolo, tipo, precoString);
    } else {
      // Se já tem, soma +1
      updateQuantity(bolo.id, tipo, 1);
    }
  };

  // Função para lidar com o botão "-"
  const handleDecrease = (tipo) => {
    const currentQty = getQuantity(tipo);
    if (currentQty > 0) {
      updateQuantity(bolo.id, tipo, -1);
    }
  };

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
                    <p className={styles.optionPrice}>R${bolo.fatia}</p>
                  </div>
                  
                  {/* Display de Quantidade */}
                  <div className={styles.quantityControl}>
                    <button 
                      onClick={() => handleDecrease('fatia')} 
                      className={styles.qtyBtn}
                      disabled={getQuantity('fatia') === 0}
                    >
                      -
                    </button>
                    <span className={styles.qtyDisplay}>{getQuantity('fatia')}</span>
                    <button 
                      onClick={() => handleIncrease('fatia', bolo.fatia)} 
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Opção Bolo Inteiro */}
                <div className={styles.optionBox}>
                  <div>
                    <span className={styles.optionTitle}>Bolo Inteiro</span>
                    <p className={styles.optionPrice}>R$ {bolo.boloInteiro}</p>
                  </div>
                  
                  {/* Novo Display de Quantidade */}
                  <div className={styles.quantityControl}>
                    <button 
                      onClick={() => handleDecrease('inteiro')} 
                      className={styles.qtyBtn}
                      disabled={getQuantity('inteiro') === 0}
                    >
                      -
                    </button>
                    <span className={styles.qtyDisplay}>{getQuantity('inteiro')}</span>
                    <button 
                      onClick={() => handleIncrease('inteiro', bolo.boloInteiro)} 
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
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