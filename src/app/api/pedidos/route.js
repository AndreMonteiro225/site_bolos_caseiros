import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, cart, valorTotal } = body;

    // 1. Insere na tabela 'pedidos'
    const queryPedido = `
      INSERT INTO pedidos (
        cliente_nome, telefone, tipo_pedido, endereco_rua, endereco_numero,
        endereco_bairro, endereco_complemento, metodo_pagamento, observacoes, valor_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const valuesPedido = [
      formData.nome,
      formData.telefone,
      formData.tipoPedido,
      formData.tipoPedido === 'Entrega' ? formData.enderecoRua : null,
      formData.tipoPedido === 'Entrega' ? formData.enderecoNumero : null,
      formData.tipoPedido === 'Entrega' ? formData.enderecoBairro : null,
      formData.tipoPedido === 'Entrega' ? formData.enderecoComplemento : null,
      formData.metodoPagamento,
      formData.observacoes || null,
      valorTotal
    ];

    const [resultPedido] = await pool.execute(queryPedido, valuesPedido);
    const pedidoId = resultPedido.insertId;

    // 2. Insere na tabela 'itens_pedido'
    const queryItens = `
      INSERT INTO itens_pedido (pedido_id, bolo_id, nome_bolo, tipo, quantidade, preco_unitario)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of cart) {
      await pool.execute(queryItens, [
        pedidoId,
        item.id,
        item.nome,
        item.tipo,
        item.quantidade,
        item.preco
      ]);
    }

    return NextResponse.json({ success: true, pedidoId: pedidoId }, { status: 201 });

  } catch (error) {
    console.error('Erro no Backend:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}

// Busca os pedidos para mostrar no Painel da Administração
export async function GET() {
  try {
    // Busca todos os pedidos, ordenando do mais recente para o mais antigo
    const query = `SELECT * FROM pedidos ORDER BY criado_em DESC`;
    const [pedidos] = await pool.execute(query);

    return NextResponse.json({ 
      success: true, 
      pedidos: pedidos 
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno ao buscar pedidos.' 
    }, { status: 500 });
  }
}