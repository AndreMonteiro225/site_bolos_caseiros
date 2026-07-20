import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { cart, pedidoId } = body;

    // Pega a URL raiz automaticamente (localhost ou vercel)
    const origin = request.nextUrl.origin;

    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

    const itemsMP = cart.map(item => ({
      id: String(item.id),
      title: `Bolo ${item.nome}`,
      quantity: Number(item.quantidade),
      unit_price: Number(item.preco),
      currency_id: 'BRL',
    }));

    const preference = new Preference(client);
    const resposta = await preference.create({
      body: {
        items: itemsMP,
        external_reference: String(pedidoId), 
        back_urls: {
          success: `${origin}/sucesso`,
          failure: `${origin}/carrinho`,
          pending: `${origin}/carrinho`
        },
        auto_return: 'approved',
      }
    });

    return NextResponse.json({ success: true, url: resposta.sandbox_init_point });

  } catch (error) {
    console.error("Erro no Mercado Pago:", error);
    return NextResponse.json({ success: false, message: "Erro ao gerar tela de pagamento." }, { status: 500 });
  }
}