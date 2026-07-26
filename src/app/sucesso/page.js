"use client";

import Link from "next/link";
import { useEffect } from "react";
// Assumindo que você tem um CartContext para limpar o carrinho. 
// Se o caminho for diferente, ajuste a importação.
import { useCart } from "../context/CartContext"; 

export default function Sucesso() {
  const { clearCart } = useCart(); // Função que zera o carrinho

  useEffect(() => {
    // Assim que o cliente cai nessa tela, nós esvaziamos o carrinho dele
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <div style={{ textAlign: "center", padding: "50px 20px", minHeight: "60vh" }}>
      <h1 style={{ color: "#4CAF50", fontSize: "2.5rem", marginBottom: "20px" }}>
        🎉 Pedido Confirmado!
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "10px" }}>
        Muito obrigado por comprar com a Bolos da Adê.
      </p>
      <p style={{ fontSize: "1rem", color: "#777", marginBottom: "40px" }}>
        Nós já recebemos o seu pedido e ele será preparado com muito carinho.
      </p>
      
      <Link 
        href="/" 
        style={{
          backgroundColor: "#ff6b6b",
          color: "white",
          padding: "15px 30px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1.1rem"
        }}
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}