// Este é o novo 'src/app/page.js'
// Ele substitui o 'pages/index.js' e DEVE ser um Client Component.
'use client'; 

import { useState } from 'react';
import Image from 'next/image';
import CakeCard from './components/CakeCard/CakeCard';
import Modal from './components/Modal/Modal';
import styles from './page.module.css';
// Dados dos Bolos (Mock)
const bolosMock = [
  {
    id: 1,
    nome: "Bolo de Fubá com Goiabada",
    descricao: "Uma receita clássica que abraça a alma. Massa fofinha de fubá artesanal com generosos pedaços de goiabada cascão derretida, coberto com um toque de açúcar e canela.",
    descricaoCurta: "Massa fofinha de fubá com generosos pedaços de goiabada cascão...",
    preco: "R$ 59,90",
    img: "/OIP.webp",
    priority: true,
  },
  {
    id: 2,
    nome: "Chocolate Belga Intenso",
    descricao: "Para os amantes de chocolate. Massa de cacau 100% com duas camadas de recheio de brigadeiro gourmet feito com chocolate belga 70% e coberto com raspas nobres.",
    descricaoCurta: "Massa de cacau 100% com recheio de brigadeiro gourmet 70%...",
    preco: "R$ 89,90",
    img: "/OIP.webp",
    priority: true,
  },
  {
    id: 3,
    nome: "Red Velvet Artesanal",
    descricao: "O clássico veludo vermelho. Massa aveludada com um toque sutil de cacau e cor intensa, recheado e coberto com um levíssimo creme de cream cheese e baunilha.",
    descricaoCurta: "Massa aveludada vermelha com recheio leve de cream cheese...",
    preco: "R$ 95,00",
    img: "/OIP.webp",
    priority: false,
  },
  {
    id: 4,
    nome: "Cenoura com Brigadeiro",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    descricaoCurta: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65,00",
    img: "/OIP.webp",
    priority: false,
  },
];


export default function Home() {
  // Estado para controlar o modal
  const [boloSelecionado, setBoloSelecionado] = useState(null);

  const abrirModal = (bolo) => {
    setBoloSelecionado(bolo);
  };

  const fecharModal = () => {
    setBoloSelecionado(null);
  };

  return (

    <>
      {/* Seção Hero */}
      <section className={styles.heroSection}>
        <div className={styles.container} style={{ textAlign: 'center' }}>
          <h1 className={styles.heroTitle}>
            Doçura e sofisticação
          </h1>
          <h2 className={styles.heroSubtitle}>
            em cada fatia
          </h2>
          <p className={styles.heroDescription}>
            Bem-vindo à Bolos da Adê, onde cada bolo é uma obra de arte artesanal, feita com os melhores ingredientes e muito carinho. Explore nosso cardápio e faça sua encomenda para retirada.
          </p>
          <a href="#cardapio" className={styles.heroButton}>
            Ver Cardápio
          </a>
        </div>
      </section>

      {/* Seção Cardápio (RF01 - Lista) */}
      <section id="cardapio" className={styles.cardapioSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nosso Cardápio</h2>
          <p className={styles.sectionSubtitle}>
            Estes são alguns dos nossos bolos mais pedidos. Clique em um bolo para ver os detalhes e fazer sua encomenda.
          </p>
          
          <div className={styles.cardGrid}>
            {bolosMock.map((bolo) => (
              <CakeCard 
                key={bolo.id} 
                bolo={bolo} 
                onCardClick={abrirModal} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Seção "Quem Somos" (RF04) */}
      <section id="sobre" className={styles.sobreSection}>
        <div className={`${styles.container} ${styles.sobreGrid}`}>
          {/* Imagem */}
          <div className={styles.sobreImageWrapper}>
            <Image
              src="https://placehold.co/600x700/E7BDBB/4A3F3C?text=Adê"
              alt="Foto da Adê, dona da confeitaria"
              width={600}
              height={700}
              className={styles.sobreImage}
            />
          </div>
          {/* Texto */}
          <div className={styles.sobreTextWrapper}>
            <h2 className={styles.sectionTitleSm}>Conheça a Adê</h2>
            <p className={styles.textLg}>
              Olá, eu sou a Adê! Minha paixão por bolos começou na cozinha da minha avó, onde aprendi que o segredo de um bolo inesquecível não está apenas nos ingredientes, mas no tempo, na dedicação e no carinho em cada etapa do preparo.
            </p>
            <p className={styles.textLg}>
              A "Bolos da Adê" nasceu desse amor. Não somos uma grande fábrica; somos um ateliê de bolos artesanais. Cada encomenda é única e preparada por mim, garantindo o sabor e a qualidade que sua família merece.
            </p>
            <p className={styles.textLg}>
              Nosso foco é 100% na retirada, pois assim consigo garantir que você leve para casa um bolo fresco, com a qualidade máxima do "feito agora". Obrigada por visitar nosso cantinho digital!
            </p>
          </div>
        </div>
      </section>

      {/* Seção Localização (RF03) */}
      <section id="local" className={styles.localSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Onde Estamos</h2>
          <p className={styles.sectionSubtitle}>
            Nossa loja não faz entregas. Todos os pedidos devem ser retirados presencialmente em nosso endereço. Veja como é fácil nos encontrar!
          </p>
          
          <div className={styles.localGrid}>
            {/* Mapa */}
            <div className={styles.localMapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.218588820986!2d-46.65657168498858!3d-23.56038318468309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c976!2sAv.%2P_Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1678886423123!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa da Localização da Bolos da Adê"
              ></iframe>
            </div>
            
            {/* Informações */}
            <div className={styles.localInfoWrapper}>
              <div>
                <h3 className={styles.localInfoTitle}>Endereço para Retirada</h3>
                <p className={styles.textLg}>
                  Av. Paulista, 1234<br />
                  Bela Vista, São Paulo - SP<br />
                  CEP: 01310-100
                </p>
                <p className={styles.localInfoSubtitle}>(Próximo ao Metrô Trianon-Masp)</p>
              </div>
              
              <hr className={styles.localDivider} />
              
              <div>
                <h3 className={styles.localInfoTitle}>Horários de Funcionamento</h3>
                <ul className={styles.localInfoList}>
                  <li><strong>Segunda a Sexta:</strong> 09:00h - 18:00h</li>
                  <li><strong>Sábado:</strong> 10:00h - 16:00h</li>
                  <li><strong>Domingo:</strong> Fechado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </section>

      {boloSelecionado && (
        <Modal bolo={boloSelecionado} onClose={fecharModal} />
      )}
    </>
  );
}