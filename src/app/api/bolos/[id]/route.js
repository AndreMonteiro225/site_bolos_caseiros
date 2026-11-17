import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { validarBolo } from '../route';

export async function PUT(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    const body = await request.json();
    const { erro, dados } = validarBolo(body);
    if (erro) return NextResponse.json({ success: false, message: erro }, { status: 400 });

    const ativo = body.ativo === false || body.ativo === 0 ? 0 : 1;
    await pool.execute(
      `UPDATE bolos SET nome=?, descricao=?, img=?, preco_fatia=?, preco_inteiro=?,
       estoque_fatias=?, estoque_inteiros=?, ativo=? WHERE id=?`,
      [dados.nome, dados.descricao, dados.img, dados.preco_fatia, dados.preco_inteiro,
       dados.estoque_fatias, dados.estoque_inteiros, ativo, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao editar bolo:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}

// "Remover" = desativar, para não quebrar o histórico de pedidos
export async function DELETE(request, { params }) {
  if (!isAdmin(request)) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
  try {
    const { id } = await params;
    await pool.execute(`UPDATE bolos SET ativo = 0 WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover bolo:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}