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
    nome: "Bolo gelado de coco",
    descricao: "Uma receita clássica que abraça a alma. Massa fofinha de fubá artesanal com generosos pedaços de goiabada cascão derretida, coberto com um toque de açúcar e canela.",
    ingredientes: "Massa fofinha de fubá com generosos pedaços de goiabada cascão...",
    preco: "59.90",
    img: "/bolo_de_cenoura.png",
    fatia: "1.00",
    boloInteiro: "59.90",
    priority: true,
  },
  {
    id: 2,
    nome: "Bolo de chocolate recheado com mouse de chocolate ",
    descricao: "Para os amantes de chocolate. Massa de cacau 100% com duas camadas de recheio de brigadeiro gourmet feito com chocolate belga 70% e coberto com raspas nobres.",
    ingredientes: "Massa de cacau 100% com recheio de brigadeiro gourmet 70%...",
    preco: "89.90",
    img: "/OIP.webp",
    priority: true,
    fatia: "12.90",
    boloInteiro: "89.90",
  },
  {
    id: 3,
    nome: "Bolo de fuba com cobertura de goiabada",
    descricao: "O clássico veludo vermelho. Massa aveludada com um toque sutil de cacau e cor intensa, recheado e coberto com um levíssimo creme de cream cheese e baunilha.",
    ingredientes: "Massa aveludada vermelha com recheio leve de cream cheese...",
    preco: "95.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "14.90",
    boloInteiro: "95.00",
  },
  {
    id: 4,
    nome: "Buba com pedaços de goiabada",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 5,
    nome: "Bolo de fuba simples",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 6,
    nome: "Bolo de iogurte com pedaços de goiabada",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 7,
    nome: " Bolo formigueiro",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 8,
    nome: "Bolo de chocolate simples",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 9,
    nome: "Bolo de milho",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 10,
    nome: " Bolo de laranja",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 11,
    nome: "Bolo de maçã com canela",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 12,
    nome: "Bolo de cenoura com cobertura de brigadeiro",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 13,
    nome: "Bolo de cenoura sem cobertura",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 14,
    nome: "Bolo de limão",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  },
  {
    id: 15,
    nome: "Bolo de café",
    descricao: "O favorito de todos. Massa de cenoura super molhadinha, feita com cenouras frescas, coberta com uma camada vulcão de brigadeiro cremoso ao leite.",
    ingredientes: "Massa de cenoura molhadinha com cobertura vulcão de brigadeiro...",
    preco: "R$ 65.00",
    img: "/OIP.webp",
    priority: false,
    fatia: "10.90",
    boloInteiro: "65.00",
  }
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