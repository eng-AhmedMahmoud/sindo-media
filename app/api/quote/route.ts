import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phoneNumber, countryCode, companyName, service, requirement } = await request.json()

    if (!fullName || !email || !phoneNumber || !service) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
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
      subject: `New Quote Request from ${fullName}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${countryCode || ''} ${phoneNumber}</p>
        <p><strong>Company Name:</strong> ${companyName || 'Not provided'}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <p><strong>Requirements:</strong></p>
        <p>${requirement ? requirement.replace(/\n/g, '<br>') : 'Not provided'}</p>
      `,
      text: `
New Quote Request

Full Name: ${fullName}
Email: ${email}
Phone Number: ${countryCode || ''} ${phoneNumber}
Company Name: ${companyName || 'Not provided'}
Service Requested: ${service}
Requirements:
${requirement || 'Not provided'}
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Quote email sent:', info.messageId, 'accepted:', info.accepted, 'rejected:', info.rejected)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error sending quote email:', message, error)
    return NextResponse.json(
      { error: 'Failed to send email', detail: message },
      { status: 500 }
    )
  }
}
