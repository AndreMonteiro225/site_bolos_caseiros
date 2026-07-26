import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Conexão com o seu banco de dados MySQL

export async function POST(request) {
  try {
    // O Mercado Pago envia avisos na URL, nós "pescamos" esses dados aqui
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const id = url.searchParams.get("data.id") || url.searchParams.get("id");

    // Se o aviso for sobre um pagamento, nós investigamos!
    if (topic === "payment" && id) {
      
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
      const payment = new Payment(client);

      // Pergunta ao Mercado Pago os detalhes verdadeiros desse pagamento
      const paymentData = await payment.get({ id });

      // Lembra do external_reference que enviamos na hora de criar o Pix? É ele aqui!
      const statusPagamento = paymentData.status; // Vai ser 'approved', 'rejected', 'pending', etc.
      const pedidoId = paymentData.external_reference; 

      console.log(`Aviso recebido: Pedido ${pedidoId} está com status ${statusPagamento}`);

      // Se o pagamento foi aprovado, atualizamos o banco da Adê
      if (statusPagamento === 'approved' && pedidoId) {
        
        // Atualiza a coluna 'status' da tabela de pedidos
        const query = `UPDATE pedidos SET status = 'Pago' WHERE id = ?`;
        await db.execute(query, [pedidoId]);
        
        console.log(`✅ Sucesso: O pedido ${pedidoId} foi marcado como Pago no MySQL!`);
      }
    }

    // O Mercado Pago exige que a gente responda com um "OK" (Status 200) bem rápido 
    // para ele saber que recebemos a mensagem.
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("Erro no Webhook:", error);
    return NextResponse.json({ received: false, error: "Erro interno" }, { status: 500 });
  }
}