import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 1. Recebemos o 'endereco' (do ViaCEP) junto com o que você já tinha
    const { formData, cart, valorTotal, endereco } = body;

    // 2. Mesclamos os dados. Se o ViaCEP achou, usamos ele. Se não, usamos o formData antigo por segurança.
    const rua = endereco?.logradouro || formData?.enderecoRua || null;
    const num = endereco?.numero || formData?.enderecoNumero || null;
    const bairro = endereco?.bairro || formData?.enderecoBairro || null;
    const comp = endereco?.complemento || formData?.enderecoComplemento || null;
    const cepViaCep = endereco?.cep || null;
    const cidade = endereco?.localidade || null; // O ViaCEP chama cidade de 'localidade'
    const uf = endereco?.uf || null;

    // 3. Insere na tabela 'pedidos' (Agora com cep, cidade e uf inclusos)
    const queryPedido = `
      INSERT INTO pedidos (
        cliente_nome, telefone, tipo_pedido, endereco_rua, endereco_numero,
        endereco_bairro, endereco_complemento, cep, cidade, uf, metodo_pagamento, observacoes, valor_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const valuesPedido = [
      formData.nome,
      formData.telefone,
      formData.tipoPedido,
      formData.tipoPedido === 'Entrega' ? rua : null,
      formData.tipoPedido === 'Entrega' ? num : null,
      formData.tipoPedido === 'Entrega' ? bairro : null,
      formData.tipoPedido === 'Entrega' ? comp : null,
      formData.tipoPedido === 'Entrega' ? cepViaCep : null,
      formData.tipoPedido === 'Entrega' ? cidade : null,
      formData.tipoPedido === 'Entrega' ? uf : null,
      formData.metodoPagamento,
      formData.observacoes || null,
      valorTotal
    ];

    const [resultPedido] = await pool.execute(queryPedido, valuesPedido);
    const pedidoId = resultPedido.insertId;

    // 4. Insere na tabela 'itens_pedido'
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

// Busca os pedidos e seus respectivos bolos
export async function GET() {
  try {
    // 1. Busca todos os pedidos
    const queryPedidos = `SELECT * FROM pedidos ORDER BY criado_em DESC`;
    const [pedidos] = await pool.execute(queryPedidos);

    // Se não tiver nenhum pedido, já devolve vazio
    if (pedidos.length === 0) {
      return NextResponse.json({ success: true, pedidos: [] }, { status: 200 });
    }

    // 2. Para cada pedido encontrado, busca os bolos dele na tabela itens_pedido
    for (let i = 0; i < pedidos.length; i++) {
      const queryItens = `SELECT * FROM itens_pedido WHERE pedido_id = ?`;
      const [itens] = await pool.execute(queryItens, [pedidos[i].id]);
      
      // Gruda os itens dentro do objeto do pedido
      pedidos[i].itens = itens; 
    }

    return NextResponse.json({ 
      success: true, 
      pedidos: pedidos 
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao buscar pedidos com itens:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno ao buscar pedidos.' 
    }, { status: 500 });
  }
}

// Atualiza o status do pedido no painel de administração
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, novoStatus } = body;

    const query = `UPDATE pedidos SET status = ? WHERE id = ?`;
    await pool.execute(query, [novoStatus, id]);

    return NextResponse.json({ success: true, message: 'Status atualizado com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return NextResponse.json({ success: false, message: 'Erro ao atualizar' }, { status: 500 });
  }
}

// Deleta um pedido permanentemente do banco de dados
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    const query = `DELETE FROM pedidos WHERE id = ?`;
    await pool.execute(query, [id]);

    return NextResponse.json({ success: true, message: 'Pedido deletado com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    return NextResponse.json({ success: false, message: 'Erro interno ao deletar.' }, { status: 500 });
  }
}