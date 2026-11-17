import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

export function validarBolo(b) {
  const nome = String(b.nome ?? '').trim();
  const precoFatia = Number(b.preco_fatia);
  const precoInteiro = Number(b.preco_inteiro);
  const estFatias = Number(b.estoque_fatias);
  const estInteiros = Number(b.estoque_inteiros);

  if (!nome) return { erro: 'Informe o nome do bolo.' };
  if (!(precoFatia > 0) || !(precoInteiro > 0)) return { erro: 'Preços devem ser maiores que zero.' };
  if (!Number.isInteger(estFatias) || estFatias < 0 || !Number.isInteger(estInteiros) || estInteiros < 0)
    return { erro: 'Estoque deve ser um número inteiro, zero ou maior.' };

  return {
    dados: {
      nome,
      descricao: String(b.descricao ?? '').trim(),
      img: String(b.img ?? '').trim() || '/OIP.webp',
      preco_fatia: precoFatia,
      preco_inteiro: precoInteiro,
      estoque_fatias: estFatias,
      estoque_inteiros: estInteiros,
    },
  };
}

export async function GET(request) {
  try {
    const todos = request.nextUrl.searchParams.get('todos') === '1' && isAdmin(request);
    const sql = `SELECT * FROM bolos ${todos ? '' : 'WHERE ativo = 1'} ORDER BY id DESC`;
    const [bolos] = await pool.execute(sql);
    return NextResponse.json({ success: true, bolos });
  } catch (error) {
    console.error('Erro ao listar bolos:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAdmin(request)) return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
  try {
    const { erro, dados } = validarBolo(await request.json());
    if (erro) return NextResponse.json({ success: false, message: erro }, { status: 400 });

    const [r] = await pool.execute(
      `INSERT INTO bolos (nome, descricao, img, preco_fatia, preco_inteiro, estoque_fatias, estoque_inteiros)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dados.nome, dados.descricao, dados.img, dados.preco_fatia, dados.preco_inteiro, dados.estoque_fatias, dados.estoque_inteiros]
    );
    return NextResponse.json({ success: true, id: r.insertId }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar bolo:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}