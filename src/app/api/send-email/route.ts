import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import WaitlistWelcomeEmail from '@/emails/waitlist-welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  try {
    const data = await resend.emails.send({
      from: 'Nutrical AI <onboarding@nutricalai.com>',
      to: email,
      subject: 'Welcome to the Nutrical AI Waitlist!',
      react: WaitlistWelcomeEmail(),
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error })
  }
}