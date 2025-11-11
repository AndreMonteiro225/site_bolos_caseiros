import Image from 'next/image';
import styles from './cakeCard.module.css';

export default function CakeCard({ bolo, onCardClick }) {
  // A função onCardClick será passada pelo 'index.js'
  const handleClick = () => {
    onCardClick(bolo);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageWrapper}>
        <Image
          src={bolo.img}
          alt={bolo.nome}
          width={400}
          height={200}
          className={styles.cardImage}
          priority={bolo.priority} // Sugestão para LCP (ex: primeiros bolos)
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{bolo.nome}</h3>
        <p className={styles.cardDescription}>{bolo.descricaoCurta}</p>
        <p className={styles.cardPrice}>{bolo.preco}</p>
      </div>
    </div>
  );
}