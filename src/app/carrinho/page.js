"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import styles from "./carrinho.module.css";

export default function CarrinhoPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    dataRetirada: "",
    horario: "",
  });

  // Calcula o valor total do carrinho
  const valorTotal = cart.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Constrói a mensagem para o WhatsApp com o resumo do pedido
    let mensagem = `*NOVO PEDIDO - AGENDAMENTO*%0A%0A`;
    mensagem += `*Cliente:* ${formData.nome}%0A`;
    mensagem += `*WhatsApp:* ${formData.telefone}%0A`;
    mensagem += `*Data da Retirada:* ${formData.dataRetirada} às ${formData.horario}%0A%0A`;
    mensagem += `*RESUMO DO PEDIDO:*%0A`;

    cart.forEach((item) => {
      mensagem += `- ${item.quantidade}x ${item.nome} (${item.tipo}) - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
    });

    mensagem += `%0A*Total: R$ ${valorTotal.toFixed(2)}*`;

    // Redireciona para o WhatsApp da Adê
    const numeroWhatsApp = "5511994246422";
    const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagem}`;

    window.open(linkWhatsApp, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <h2>Seu carrinho está vazio 😕</h2>
        <Link href="/" className={styles.backButton}>
          Ver cardápio
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Finalizar Pedido</h1>

      <div className={styles.contentGrid}>
        {/* Lado Esquerdo: Resumo do Carrinho */}
        <div className={styles.cartSection}>
          <h2>Seus Bolos</h2>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={`${item.id}-${item.tipo}`} className={styles.cartItem}>
                <Image
                  src={item.imagem}
                  alt={item.nome}
                  width={60}
                  height={60}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <h3>{item.nome}</h3>
                  <p>
                    Opção: {item.tipo === "inteiro" ? "Bolo Inteiro" : "Fatia"}
                  </p>
                  <p>Qtd: {item.quantidade}</p>
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemPrice}>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>

                  {/* Controles de Quantidade */}
                  <div className={styles.quantityControl}>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.tipo, -1)}
                      className={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.tipo, 1)}
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.tipo)}
                    className={styles.removeBtn}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.totalBox}>
            <h3>Total do Pedido:</h3>
            <h3>R$ {valorTotal.toFixed(2)}</h3>
          </div>
        </div>

        {/* Lado Direito: Formulário de Agendamento */}
        <div className={styles.formSection}>
          <h2>Dados para Retirada</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Nome Completo</label>
              <input
                type="text"
                name="nome"
                required
                value={formData.nome}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>WhatsApp</label>
              <input
                type="tel"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                className={styles.input}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Data da Retirada</label>
                <input
                  type="date"
                  name="dataRetirada"
                  required
                  value={formData.dataRetirada}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Horário</label>
                <input
                  type="time"
                  name="horario"
                  required
                  value={formData.horario}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitButton}>
              Agendar e Enviar p/ WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
