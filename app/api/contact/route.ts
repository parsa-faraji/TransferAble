import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // TODO: In production, you might want to:
    // 1. Send email via SendGrid, Resend, or similar service
    // 2. Store in database for support ticket tracking
    // 3. Send notification to admin team
    
    // For now, just log the contact form submission
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // In a real implementation, you would:
    // await sendEmail({
    //   to: "support@transferable.com",
    //   from: email,
    //   subject: `Contact Form: ${subject}`,
    //   text: `From: ${name} (${email})\n\n${message}`,
    // });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}







