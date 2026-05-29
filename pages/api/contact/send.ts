import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { sendEmail, generateContactEmailHTML, generateConfirmationEmailHTML } from '@/lib/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Get contact settings
    let settings = await prisma.contactSettings.findFirst();
    if (!settings) {
      settings = await prisma.contactSettings.create({
        data: { email: process.env.CONTACT_EMAIL || 'info@sblueenergy.com' },
      });
    }

    // Save message to database
    await prisma.contactMessage.create({
      data: { name, email, message },
    });

    // Send email to admin
    const adminEmailHTML = generateContactEmailHTML(name, email, message);
    await sendEmail(
      settings.email,
      `New Contact Form Submission from ${name}`,
      adminEmailHTML
    );

    // Send confirmation email to user
    const userEmailHTML = generateConfirmationEmailHTML(name);
    await sendEmail(
      email,
      'We received your message',
      userEmailHTML
    );

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
