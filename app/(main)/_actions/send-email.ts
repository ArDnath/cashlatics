"use server";

import { Resend } from "resend";
import { ReactNode } from "react";

// Initialize Resend outside the function to reuse the instance
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  to: string | string[];
  subject: string;
  react: ReactNode;
}

export async function sendEmail({ to, subject, react }: SendEmailProps) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Cashlatics App <onboarding@resend.dev>",
      to,
      subject,
      react,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to send email";
    console.error("Email Error:", msg);
    return { success: false, error: msg };
  }
}
