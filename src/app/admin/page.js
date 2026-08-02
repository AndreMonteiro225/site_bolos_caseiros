"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Novos estados para o Login
  const [isLogged, setIsLogged] = useState(false);
  const [senhaInput, setSenhaInput] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  // Verifica se a Adê já logou antes (para não pedir a senha toda vez que ela atualizar a página)
  useEffect(() => {
    const session = localStorage.getItem("ade_admin_logged");
    if (session === "true") {
      setIsLogged(true);
      buscarPedidos();
    } else {
      setLoading(false); // Mostra a tela de login
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErroLogin("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha: senhaInput }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("ade_admin_logged", "true"); // Salva o login no navegador dela
        setIsLogged(true);
        buscarPedidos();
      } else {
        setErroLogin("Senha incorreta! Tente novamente.");
        setLoading(false);
      }
    } catch (error) {
      setErroLogin("Erro de conexão.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ade_admin_logged");
    setIsLogged(false);
    setPedidos([]);
  };

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
      setLoading(false);
    }
  };

  const atualizarStatus = async (id, novoStatus) => {
    try {
      const res = await fetch("/api/pedidos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, novoStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setPedidos(
          pedidos.map((pedido) =>
            pedido.id === id ? { ...pedido, status: novoStatus } : pedido,
          ),
        );
      } else {
        alert("Erro ao mudar o status.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão ao tentar mudar o status.");
    }
  };

  const deletarPedido = async (id) => {
    // Alerta de confirmação para segurança
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este pedido permanentemente?",
    );
    if (!confirmar) return;

    try {
      const res = await fetch("/api/pedidos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        // Remove o pedido da tela sem precisar dar F5
        setPedidos(pedidos.filter((pedido) => pedido.id !== id));
      } else {
        alert("Erro ao excluir o pedido.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão ao tentar excluir.");
    }
  };

  // --------------------------------------------------
  // TELA 1: SE NÃO ESTIVER LOGADA, MOSTRA O FORMULÁRIO
  // --------------------------------------------------
  if (!isLogged) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h2>Área Restrita</h2>
          <p>Digite a senha para acessar os pedidos</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              placeholder="Sua senha secreta"
              required
              className={styles.loginInput}
            />
            {erroLogin && <p className={styles.erroText}>{erroLogin}</p>}
            <button
              type="submit"
              disabled={loading}
              className={styles.loginBtn}
            >
              {loading ? "Entrando..." : "Entrar no Painel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // TELA 2: SE ESTIVER LOGADA, MOSTRA O PAINEL DE PEDIDOS
  // --------------------------------------------------
  if (loading) {
    return <div className={styles.loading}>Carregando pedidos da Adê...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerDashboard}>
        <h1 className={styles.title}>Painel de Pedidos</h1>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sair
        </button>
      </div>

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
                  <option value="Saiu para Entrega">
                    🛵 Saiu para Entrega
                  </option>
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
                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(pedido.criado_em).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                {pedido.tipo_pedido === "Entrega" && (
                  <div className={styles.enderecoBox}>
                    <h3>📍 Dados de Entrega</h3>
                    <p>
                      <strong>Rua:</strong> {pedido.endereco_rua}, Nº{" "}
                      {pedido.endereco_numero}
                    </p>
                    {pedido.endereco_complemento && (
                      <p>
                        <strong>Complemento:</strong>{" "}
                        {pedido.endereco_complemento}
                      </p>
                    )}
                    <p>
                      <strong>Bairro:</strong> {pedido.endereco_bairro}
                    </p>
                    <p>
                      <strong>Cidade:</strong> {pedido.cidade} / {pedido.uf}
                    </p>
                    <p>
                      <strong>CEP:</strong> {pedido.cep}
                    </p>
                  </div>
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
                <button
                  onClick={() => deletarPedido(pedido.id)}
                  className={styles.btnDeletar}
                  title="Excluir Pedido"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
