import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, project } = await request.json()

    if (!name || !email || !project) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials missing: set SMTP_USER and SMTP_PASSWORD env vars')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const fromAddress = process.env.SMTP_FROM
      ? `"Sindo Media" <${process.env.SMTP_FROM}>`
      : `"Sindo Media" <${process.env.SMTP_USER}>`

    const mailOptions = {
      from: fromAddress,
      sender: process.env.SMTP_USER,
      to: ['contact@sindo-media.agency', 'ahmedkhalil9798@gmail.com'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Request:</strong></p>
        <p>${project.replace(/\n/g, '<br>')}</p>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Project Request:
${project}
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Contact email sent:', info.messageId, 'accepted:', info.accepted, 'rejected:', info.rejected)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error sending contact email:', message, error)
    return NextResponse.json(
      { error: 'Failed to send email', detail: message },
      { status: 500 }
    )
  }
}
