"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assim que a página abre, ela chama a nossa API
  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      const res = await fetch("/api/pedidos");
      const data = await res.json();

      if (data.success) {
        setPedidos(data.pedidos);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false); // Desliga o aviso de "Carregando"
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, novoStatus }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Atualiza a tela instantaneamente sem precisar dar F5
        setPedidos(pedidos.map(pedido => 
          pedido.id === id ? { ...pedido, status: novoStatus } : pedido
        ));
      } else {
        alert('Erro ao mudar o status.');
      }
    } catch (error) {
      console.error("Erro:", error);
      alert('Erro de conexão ao tentar mudar o status.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando pedidos da Adê...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Painel de Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className={styles.empty}>Nenhum pedido recebido ainda.</p>
      ) : (
        <div className={styles.pedidosGrid}>
          {pedidos.map((pedido) => (
            <div key={pedido.id} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <h2>Pedido #{pedido.id}</h2>
                <select 
                className={styles.statusSelect} 
                value={pedido.status}
                onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
              >
                <option value="Pendente">⏳ Pendente</option>
                <option value="Em Preparo">🥣 Em Preparo</option>
                <option value="Pronto">✅ Pronto</option>
                <option value="Saiu para Entrega">🛵 Saiu para Entrega</option>
                <option value="Entregue">🎉 Entregue</option>
                <option value="Cancelado">❌ Cancelado</option>
              </select>
              </div>

              <div className={styles.pedidoBody}>
                <p>
                  <strong>Cliente:</strong> {pedido.cliente_nome}
                </p>
                <p>
                  <strong>WhatsApp:</strong> {pedido.telefone}
                </p>
                <p>
                  <strong>Tipo:</strong> {pedido.tipo_pedido}
                </p>

                {pedido.tipo_pedido === "Entrega" && (
                  <p>
                    <strong>Endereço:</strong> {pedido.endereco_rua},{" "}
                    {pedido.endereco_numero} - {pedido.endereco_bairro}
                  </p>
                )}

                <p>
                  <strong>Pagamento:</strong> {pedido.metodo_pagamento}
                </p>

                {pedido.observacoes && (
                  <p className={styles.obs}>
                    <strong>Obs:</strong> {pedido.observacoes}
                  </p>
                )}

                <div className={styles.itensList}>
                  <h4>🧁 O que preparar:</h4>
                  <ul>
                    {pedido.itens &&
                      pedido.itens.map((item) => (
                        <li key={item.id}>
                          <strong>{item.quantidade}x</strong> {item.nome_bolo} (
                          {item.tipo === "inteiro" ? "Inteiro" : "Fatia"})
                          <span className={styles.itemPreco}>
                            R${" "}
                            {Number(
                              item.preco_unitario * item.quantidade,
                            ).toFixed(2)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              <div className={styles.pedidoFooter}>
                <h3>Total: R$ {Number(pedido.valor_total).toFixed(2)}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
