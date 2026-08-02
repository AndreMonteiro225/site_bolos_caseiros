"use client";

import { useCart } from "../context/CartContext";
import styles from "./carrinho.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Carrinho() {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  // Estados do Frete e Endereço
  const [cep, setCep] = useState("");
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [endereco, setEndereco] = useState(null);
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [loadingPagamento, setLoadingPagamento] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Cálculos de Totais
  const totalBolos = cart.reduce(
    (acc, item) => acc + Number(item.preco) * Number(item.quantidade),
    0,
  );
  const totalComFrete = totalBolos + taxaEntrega;

  // Função que busca o CEP na API e calcula o Frete
  const buscarCepECalcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("Por favor, insira um CEP válido com 8 dígitos.");
      setTaxaEntrega(0);
      setEndereco(null);
      return;
    }

    setLoadingCep(true);

    try {
      // 1. Busca os dados da rua na API do ViaCEP
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP não encontrado. Verifique se digitou corretamente.");
        setTaxaEntrega(0);
        setEndereco(null);
        setLoadingCep(false);
        return;
      }

      // 2. Salva o endereço na tela
      setEndereco(data);

      // 3. Calcula o valor do frete pelas nossas regras
      const cepNum = parseInt(cepLimpo, 10);
      let valorCalculado = 0;

      if (cepNum >= 5000000 && cepNum <= 5099999) {
        valorCalculado = 7.0; // Zona 1: Perdizes, Água Branca, etc
      } else if (cepNum >= 5100000 && cepNum <= 5499999) {
        valorCalculado = 12.0; // Zona 2: Lapa, Pinheiros, etc
      } else if (cepNum >= 1200000 && cepNum <= 1499999) {
        valorCalculado = 16.0; // Zona 3: Centro, Higienópolis
      } else {
        alert(
          "Poxa! 😢 Ainda não fazemos entregas para esta região. Tente um endereço mais próximo da Água Branca!",
        );
        setTaxaEntrega(0);
        setEndereco(null);
        setLoadingCep(false);
        return;
      }

      setTaxaEntrega(valorCalculado);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Ocorreu um erro ao buscar o endereço.");
    }

    setLoadingCep(false);
  };

  const finalizarCompra = async () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // Validações antes de deixar o cliente pagar
    if (taxaEntrega === 0 || !endereco) {
      alert("Por favor, calcule o frete antes de finalizar o pedido.");
      return;
    }

    if (numero.trim() === "") {
      alert("Por favor, digite o número do endereço para a entrega.");
      return;
    }

    setLoadingPagamento(true);

    // Montando o objeto completo do endereço para salvar no banco depois
    const enderecoCompleto = {
      ...endereco,
      numero,
      complemento,
    };

    try {
      // 1. Salvar pedido no MySQL como "Pendente"
      const resPedido = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: formData, // Os dados do cliente (nome, telefone)
          cart: cart, // Os bolos
          valorTotal: totalComFrete, // O total já somado com a taxa de entrega
          endereco: enderecoCompleto, // O objeto com os dados do ViaCEP e número da casa
        }),
      });

      const pedidoData = await resPedido.json();

      if (pedidoData.success) {
        // 2. Chamar a rota do Mercado Pago
        const resMP = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cart,
            pedidoId: pedidoData.pedidoId,
            taxaEntrega: taxaEntrega,
          }),
        });

        const mpData = await resMP.json();

        if (mpData.success && mpData.url) {
          window.location.href = mpData.url;
        } else {
          alert(
            "Erro ao gerar pagamento: " +
              (mpData.message || "Erro desconhecido"),
          );
          setLoadingPagamento(false);
        }
      } else {
        alert("Erro ao salvar pedido no banco.");
        setLoadingPagamento(false);
      }
    } catch (error) {
      console.error("Erro no fluxo de checkout:", error);
      alert("Ocorreu um erro ao processar seu pedido.");
      setLoadingPagamento(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <h1>Seu Carrinho</h1>
        <p>Você ainda não escolheu nenhum bolo. :(</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Seu Carrinho</h1>
      <ul className={styles.lista}>
        {cart.map((item) => (
          <li key={item.id} className={styles.item}>
            <span>
              {item.quantidade}x Bolo {item.nome}
            </span>
            <span>
              R${" "}
              {(Number(item.preco) * Number(item.quantidade))
                .toFixed(2)
                .replace(".", ",")}
            </span>
            <button
              onClick={() => removeFromCart(item.id)}
              className={styles.btnRemover}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      {/* --- SEÇÃO DE CÁLCULO DE FRETE E ENDEREÇO --- */}
      <div
        className={styles.freteSection}
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Onde vamos entregar?</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              flex: 1,
            }}
            maxLength="9"
          />
          <button
            onClick={buscarCepECalcularFrete}
            disabled={loadingCep}
            style={{
              padding: "10px 20px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loadingCep ? "Buscando..." : "Calcular"}
          </button>
        </div>
        {/* O formulário de endereço só aparece se o ViaCEP retornar sucesso e o frete for aprovado */}
        {endereco && taxaEntrega > 0 && (
          <div style={{ marginTop: "20px", textAlign: "left" }}>
            <p style={{ margin: "5px 0", color: "#555" }}>
              <strong>Logradouro:</strong> {endereco.logradouro}
            </p>
            <p style={{ margin: "5px 0", color: "#555" }}>
              <strong>Bairro:</strong> {endereco.bairro} - {endereco.localidade}
              /{endereco.uf}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                style={{
                  padding: "10px",
                  width: "100px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Complemento (Apto, Bloco, etc - Opcional)"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                style={{
                  padding: "10px",
                  flex: 1,
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#e8f5e9",
                border: "1px solid #c8e6c9",
                borderRadius: "4px",
              }}
            >
              <p style={{ color: "#2e7d32", fontWeight: "bold", margin: 0 }}>
                Taxa de Entrega: R$ {taxaEntrega.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* --------------------------------- */}

      <div
        className={styles.totalSection}
        style={{ marginTop: "20px", textAlign: "right" }}
      >
        <p>Subtotal (Bolos): R$ {totalBolos.toFixed(2).replace(".", ",")}</p>
        <p>Frete: R$ {taxaEntrega.toFixed(2).replace(".", ",")}</p>
        <h2 style={{ color: "#d32f2f", marginTop: "10px" }}>
          Total a Pagar: R$ {totalComFrete.toFixed(2).replace(".", ",")}
        </h2>
      </div>

      <button
        className={styles.btnFinalizar}
        onClick={finalizarCompra}
        disabled={loadingPagamento}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "15px",
          fontSize: "1.2rem",
          backgroundColor: loadingPagamento ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loadingPagamento ? "not-allowed" : "pointer",
          fontWeight: "bold",
        }}
      >
        {loadingPagamento
          ? "Processando..."
          : "Confirmar Pedido e Ir para Pagamento"}
      </button>
    </div>
  );
}
