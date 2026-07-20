import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { senha } = await request.json();
    
    // Puxa a senha verdadeira do arquivo .env.local
    const senhaCorreta = process.env.ADMIN_PASSWORD;

    if (senha === senhaCorreta) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Senha incorreta' }, { status: 401 });
    }

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}