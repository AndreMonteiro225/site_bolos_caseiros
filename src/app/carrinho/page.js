"use client";

import { useCart } from '../context/CartContext';
import styles from './carrinho.module.css';
import { useState } from 'react';

export default function Carrinho() {
  const { cart, removeFromCart } = useCart();

  // Estados dos Dados do Cliente
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipoPedido, setTipoPedido] = useState('Entrega');
  const [observacoes, setObservacoes] = useState('');

  // Estados do Frete e Endereço
  const [cep, setCep] = useState('');
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [endereco, setEndereco] = useState(null);
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  
  const [loadingPagamento, setLoadingPagamento] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Cálculos de Totais
  const totalBolos = cart.reduce((acc, item) => acc + (Number(item.preco) * Number(item.quantidade)), 0);
  
  // Se for retirada, a taxa é 0 independentemente do que foi calculado antes
  const freteFinal = tipoPedido === 'Entrega' ? taxaEntrega : 0;
  const totalComFrete = totalBolos + freteFinal;

  // Função que busca o CEP na API e calcula o Frete
  const buscarCepECalcularFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
      alert("Por favor, insira um CEP válido com 8 dígitos.");
      setTaxaEntrega(0);
      setEndereco(null);
      return;
    }

    setLoadingCep(true);

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP não encontrado. Verifique se digitou corretamente.");
        setTaxaEntrega(0);
        setEndereco(null);
        setLoadingCep(false);
        return;
      }

      setEndereco(data);

      const cepNum = parseInt(cepLimpo, 10);
      let valorCalculado = 0;

      if (cepNum >= 5000000 && cepNum <= 5099999) {
          valorCalculado = 7.00;
      } else if (cepNum >= 5100000 && cepNum <= 5499999) {
          valorCalculado = 12.00; 
      } else if (cepNum >= 1200000 && cepNum <= 1499999) {
          valorCalculado = 16.00; 
      } else {
          alert("Poxa! 😢 Ainda não fazemos entregas para esta região. Tente um endereço mais próximo da Água Branca!");
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

    // Validação dos dados do cliente
    if (!nome.trim() || !telefone.trim()) {
      alert("Por favor, preencha seu nome e telefone para continuarmos.");
      return;
    }

    // Validação específica para Entrega
    if (tipoPedido === 'Entrega') {
      if (taxaEntrega === 0 || !endereco) {
          alert("Por favor, calcule o frete antes de finalizar o pedido.");
          return;
      }
      if (numero.trim() === '') {
          alert("Por favor, digite o número do endereço para a entrega.");
          return;
      }
    }

    setLoadingPagamento(true);

    const enderecoCompleto = endereco ? {
      ...endereco,
      numero,
      complemento
    } : null;

    // Objeto formData exatamente como o backend está esperando
    const formData = {
      nome,
      telefone,
      tipoPedido,
      observacoes,
      metodoPagamento: 'Mercado Pago' // Enviando o método fixo para o BD
    };

    try {
      // 1. Salvar pedido no MySQL como "Pendente"
      const resPedido = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formData, 
          cart,
          valorTotal: totalComFrete,
          endereco: enderecoCompleto 
        })
      });

      const pedidoData = await resPedido.json();

      if (pedidoData.success) {
        // 2. Chamar a rota do Mercado Pago
        const resMP = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                cart: cart, 
                pedidoId: pedidoData.pedidoId,
                taxaEntrega: freteFinal 
            })
        });

        const mpData = await resMP.json();

        if (mpData.success && mpData.url) {
             window.location.href = mpData.url; 
        } else {
             alert("Erro ao gerar pagamento: " + (mpData.message || "Erro desconhecido"));
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
            <span>{item.quantidade}x Bolo {item.nome}</span>
            <span>R$ {(Number(item.preco) * Number(item.quantidade)).toFixed(2).replace('.', ',')}</span>
            <button onClick={() => removeFromCart(item.id)} className={styles.btnRemover}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      {/* --- DADOS DO CLIENTE E PEDIDO --- */}
      <div className={styles.formSection}>
        <h3 className={styles.freteTitle}>Seus Dados</h3>
        
        <div className={styles.formGroup}>
          <label>Nome Completo:</label>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="Como podemos te chamar?"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Telefone / WhatsApp:</label>
          <input 
            type="tel" 
            className={styles.input} 
            placeholder="(11) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Como deseja receber?</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="tipoPedido" 
                value="Entrega" 
                checked={tipoPedido === 'Entrega'}
                onChange={() => setTipoPedido('Entrega')}
              />
              Receber em casa (Delivery)
            </label>
            <label className={styles.radioLabel}>
              <input 
                type="radio" 
                name="tipoPedido" 
                value="Retirada" 
                checked={tipoPedido === 'Retirada'}
                onChange={() => setTipoPedido('Retirada')}
              />
              Vou retirar na loja
            </label>
          </div>
        </div>

        {/* Campo de endereço aparece apenas se for Entrega */}
        {tipoPedido === 'Entrega' && (
          <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px dashed #ccc' }}>
            <h4 style={{ marginBottom: '10px' }}>Endereço de Entrega</h4>
            <div className={styles.inputGroup}>
                <input 
                    type="text" 
                    placeholder="Digite seu CEP" 
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className={styles.input}
                    maxLength="9"
                />
                <button 
                  onClick={buscarCepECalcularFrete}
                  disabled={loadingCep}
                  className={styles.btnCalcular}
                >
                    {loadingCep ? 'Buscando...' : 'Calcular Frete'}
                </button>
            </div>

            {endereco && taxaEntrega > 0 && (
              <div className={styles.enderecoInfo}>
                <p className={styles.enderecoTexto}><strong>Rua:</strong> {endereco.logradouro}</p>
                <p className={styles.enderecoTexto}><strong>Bairro:</strong> {endereco.bairro} - {endereco.localidade}/{endereco.uf}</p>
                
                <div className={styles.inputGroup} style={{ marginTop: '15px' }}>
                  <input 
                    type="text" 
                    placeholder="Número" 
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className={styles.inputNumero}
                  />
                  <input 
                    type="text" 
                    placeholder="Complemento (Opcional)" 
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.taxaContainer}>
                  <p className={styles.taxaTexto}>
                      Taxa de Entrega: R$ {taxaEntrega.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.formGroup} style={{ marginTop: '20px' }}>
          <label>Observações do Pedido (Opcional):</label>
          <textarea 
            className={styles.textarea} 
            placeholder="Ex: Mandar troco para R$ 100, bolo sem granulado, etc."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* --- TOTAL E FINALIZAÇÃO --- */}
      <div className={styles.totalSection}>
        <p>Subtotal (Bolos): R$ {totalBolos.toFixed(2).replace('.', ',')}</p>
        {tipoPedido === 'Entrega' ? (
          <p>Frete: R$ {taxaEntrega.toFixed(2).replace('.', ',')}</p>
        ) : (
          <p>Frete: Grátis (Retirada)</p>
        )}
        <h2 className={styles.totalDestaque}>
          Total a Pagar: R$ {totalComFrete.toFixed(2).replace('.', ',')}
        </h2>
      </div>

      <button 
        className={styles.btnFinalizar} 
        onClick={finalizarCompra}
        disabled={loadingPagamento}
      >
        {loadingPagamento ? 'Processando...' : 'Confirmar Pedido e Pagar'}
      </button>
    </div>
  );
}