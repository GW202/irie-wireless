import { NextRequest, NextResponse } from 'next/server';

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'partners@iriewireless.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, business, email, phone, type, notes } = body;

    // Validation
    if (!name || !business || !email || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Only send emails if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      // Send notification to team
      await resend.emails.send({
        from: 'Irie Wireless <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        subject: `New Partner Inquiry from ${name} (${business})`,
        html: `
          <h2>New Partner Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Business:</strong> ${business}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Organization Type:</strong> ${type}</p>
          <p><strong>Notes:</strong> ${notes || 'None'}</p>
        `,
      });

      // Send confirmation to submitter
      await resend.emails.send({
        from: 'Irie Wireless <onboarding@resend.dev>',
        to: [email],
        subject: 'Thank you for contacting Irie Wireless',
        html: `
          <h2>Thank you, ${name}!</h2>
          <p>We've received your inquiry and our team will review it within 24 hours.</p>
          <p>In the meantime, feel free to explore our platform at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://iriewireless.com'}">iriewireless.com</a>.</p>
          <br/>
          <p>— The Irie Wireless Team</p>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry' },
      { status: 500 }
    );
  }
}
