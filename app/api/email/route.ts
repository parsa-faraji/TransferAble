import { NextResponse } from "next/server";

// Email service using Resend (recommended) or Nodemailer
// For now, we'll use a simple implementation that can be upgraded

const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "hello@transferable.app";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // If Resend API key is set, use Resend
    if (RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `TransferAble <${COMPANY_EMAIL}>`,
          to,
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send email");
      }

      const data = await response.json();
      return NextResponse.json({ success: true, id: data.id });
    }

    // Fallback: Log email (for development)
    console.log("Email would be sent:", {
      from: COMPANY_EMAIL,
      to,
      subject,
      html: html || text,
    });

    return NextResponse.json({
      success: true,
      message: "Email logged (RESEND_API_KEY not set - add it to enable real emails)",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}




