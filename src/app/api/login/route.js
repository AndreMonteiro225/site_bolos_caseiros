import { NextResponse } from 'next/server';
import { createSessionToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { senha } = await request.json();

    if (!senha || senha !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Senha incorreta' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', createSessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}