'use client';

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assim que a página abre, ela chama a nossa API
  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos');
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
                <span className={styles.status}>{pedido.status}</span>
              </div>
              
              <div className={styles.pedidoBody}>
                <p><strong>Cliente:</strong> {pedido.cliente_nome}</p>
                <p><strong>WhatsApp:</strong> {pedido.telefone}</p>
                <p><strong>Tipo:</strong> {pedido.tipo_pedido}</p>
                
                {pedido.tipo_pedido === 'Entrega' && (
                  <p><strong>Endereço:</strong> {pedido.endereco_rua}, {pedido.endereco_numero} - {pedido.endereco_bairro}</p>
                )}
                
                <p><strong>Pagamento:</strong> {pedido.metodo_pagamento}</p>
                
                {pedido.observacoes && (
                  <p className={styles.obs}><strong>Obs:</strong> {pedido.observacoes}</p>
                )}
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