import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { fullName, phoneNumber, countryCode, companyName, service, requirement } = await request.json()

    if (!fullName || !phoneNumber || !service) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
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

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'contact@sindo-media.agency',
      subject: `New Quote Request from ${fullName}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Phone Number:</strong> ${countryCode || ''} ${phoneNumber}</p>
        <p><strong>Company Name:</strong> ${companyName || 'Not provided'}</p>
        <p><strong>Service Requested:</strong> ${service}</p>
        <p><strong>Requirements:</strong></p>
        <p>${requirement ? requirement.replace(/\n/g, '<br>') : 'Not provided'}</p>
      `,
      text: `
New Quote Request

Full Name: ${fullName}
Phone Number: ${countryCode || ''} ${phoneNumber}
Company Name: ${companyName || 'Not provided'}
Service Requested: ${service}
Requirements:
${requirement || 'Not provided'}
      `,
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
