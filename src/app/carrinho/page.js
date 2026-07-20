"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import styles from "./carrinho.module.css";

export default function CarrinhoPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // O estado agora reflete exatamente o novo banco de dados
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    tipoPedido: "Retirada", // Começa como Retirada por padrão
    enderecoRua: "",
    enderecoNumero: "",
    enderecoBairro: "",
    enderecoComplemento: "",
    metodoPagamento: "PIX",
    observacoes: "",
  });

  const valorDosBolos = cart.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );

  // Se for Entrega, podemos cobrar uma taxa. Por enquanto deixei 0, mas você pode mudar depois.
  const taxaEntrega = formData.tipoPedido === "Entrega" ? 0.0 : 0.0;
  const valorTotal = valorDosBolos + taxaEntrega;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { formData, cart, valorTotal };

    try {
      // 1. Envia os dados para a API (MySQL)
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Ops! Houve um erro ao processar seu pedido.");
        return;
      }

      const numeroPedido = data.pedidoId;

      let mensagem = `*NOVO PEDIDO - Nº ${numeroPedido}*\n\n`;
      mensagem += `*Cliente:* ${formData.nome}\n`;
      mensagem += `*WhatsApp:* ${formData.telefone}\n`;
      mensagem += `*Tipo de Pedido:* ${formData.tipoPedido}\n`;

      if (formData.tipoPedido === "Entrega") {
        mensagem += `*Endereço:* ${formData.enderecoRua}, ${formData.enderecoNumero} - ${formData.enderecoBairro}`;
        if (formData.enderecoComplemento) {
          mensagem += ` (${formData.enderecoComplemento})`;
        }
        mensagem += `\n`;
      }

      mensagem += `*Pagamento:* ${formData.metodoPagamento}\n`;
      if (formData.observacoes) {
        mensagem += `*Observações:* ${formData.observacoes}\n`;
      }

      mensagem += `\n*RESUMO DO PEDIDO:*\n`;
      cart.forEach((item) => {
        mensagem += `- ${item.quantidade}x ${item.nome} (${item.tipo}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
      });

      mensagem += `\n*Total: R$ ${valorTotal.toFixed(2)}*`;

      // 3. Abre o WhatsApp com segurança usando encodeURIComponent
      const numeroWhatsApp = "5511994246422";
      const linkWhatsApp = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
      window.open(linkWhatsApp, "_blank");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    }
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
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemPrice}>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
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
            <h3>Total dos Bolos:</h3>
            <h3>R$ {valorDosBolos.toFixed(2)}</h3>
          </div>

          {formData.tipoPedido === "Entrega" && taxaEntrega > 0 && (
            <div
              className={styles.totalBox}
              style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#666" }}
            >
              <p>Taxa de Entrega:</p>
              <p>R$ {taxaEntrega.toFixed(2)}</p>
            </div>
          )}

          <div
            className={styles.totalBox}
            style={{
              borderTop: "2px solid #eee",
              paddingTop: "1rem",
              marginTop: "1rem",
            }}
          >
            <h3>Total a Pagar:</h3>
            <h3 style={{ color: "var(--cor-cta)" }}>
              R$ {valorTotal.toFixed(2)}
            </h3>
          </div>
        </div>

        {/* Lado Direito: Formulário Atualizado */}
        <div className={styles.formSection}>
          <h2>Dados do Pedido</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Nome Completo *</label>
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
                <label>WhatsApp *</label>
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
            </div>

            <div className={styles.inputGroup}>
              <label>Como deseja receber? *</label>
              <select
                name="tipoPedido"
                value={formData.tipoPedido}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="Retirada">Vou retirar no local</option>
                <option value="Entrega">
                  Quero receber em casa (Delivery)
                </option>
              </select>
            </div>

            {/* SEÇÃO DE ENDEREÇO: Só aparece se a pessoa escolher "Entrega" */}
            {formData.tipoPedido === "Entrega" && (
              <div className={styles.addressBox}>
                <h3 className={styles.sectionSubtitle}>Endereço de Entrega</h3>
                <div className={styles.inputGroup}>
                  <label>Rua / Avenida *</label>
                  <input
                    type="text"
                    name="enderecoRua"
                    required
                    value={formData.enderecoRua}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Número *</label>
                    <input
                      type="text"
                      name="enderecoNumero"
                      required
                      value={formData.enderecoNumero}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Bairro *</label>
                    <input
                      type="text"
                      name="enderecoBairro"
                      required
                      value={formData.enderecoBairro}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Complemento (Opcional)</label>
                  <input
                    type="text"
                    name="enderecoComplemento"
                    value={formData.enderecoComplemento}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Apto, Bloco, Casa 2..."
                  />
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Forma de Pagamento *</label>
              <select
                name="metodoPagamento"
                value={formData.metodoPagamento}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">
                  Cartão de Crédito (na entrega)
                </option>
                <option value="Cartão de Débito">
                  Cartão de Débito (na entrega)
                </option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Observações do Pedido (Opcional)</label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                className={`${styles.input} ${styles.textarea}`}
                placeholder="Ex: Tocar a campainha, alérgico a nozes, troco para 50..."
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Confirmar Pedido (WhatsApp)
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
