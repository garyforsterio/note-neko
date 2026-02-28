import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
	to: string;
	subject: string;
	text: string;
	html: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
	const { data, error } = await resend.emails.send({
		from: "Note Neko <noreply@note-neko.com>",
		to,
		subject,
		text,
		html,
	});

	if (error) {
		throw new Error(`Failed to send email: ${error.message}`);
	}

	return data;
}
