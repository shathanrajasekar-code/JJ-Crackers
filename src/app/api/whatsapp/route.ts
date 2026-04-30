import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message') || '';

    const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '917092300252';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return NextResponse.redirect(whatsappUrl);
  } catch (error) {
    console.error('Error in WhatsApp API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, items, customerName, customerCity } = body;

    const phoneNumber = process.env.NEXT_PUBLIC_WA_NUMBER || '917092300252';

    // Build message if not provided
    let formattedMessage = message;
    if (!formattedMessage && items) {
      const itemLines = items.map((item: { qty: number; name: string; price: number }) =>
        `• ${item.qty} x ${item.name} — ₹${(item.price * item.qty).toLocaleString('en-IN')}`
      ).join('\n');

      const total = items.reduce((sum: number, i: { qty: number; price: number }) => sum + i.price * i.qty, 0);
      const totalItems = items.reduce((sum: number, i: { qty: number }) => sum + i.qty, 0);

      formattedMessage = [
        'நமஸ்காரம் Jegajothi Crackers! 🙏',
        '',
        'I would like to place a cracker enquiry:',
        '',
        itemLines,
        '',
        `📦 Total Items: ${totalItems}`,
        `💰 Estimated Total: ₹${total.toLocaleString('en-IN')}`,
        '',
        'Please confirm stock and final pricing. Thank you! 🎆',
        customerName ? `👤 Name: ${customerName}` : '',
        customerCity ? `📍 Location: ${customerCity}` : '',
      ].filter(Boolean).join('\n');
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(formattedMessage || '')}`;

    return NextResponse.json({ url: whatsappUrl });
  } catch (error) {
    console.error('Error in WhatsApp API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
