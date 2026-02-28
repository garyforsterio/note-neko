interface PasswordResetEmailOptions {
	resetUrl: string;
	locale: string;
}

const translations = {
	en: {
		subject: "Reset your password",
		heading: "Reset Your Password",
		body: "You requested a password reset for your Note Neko account. Click the button below to set a new password.",
		buttonText: "Reset Password",
		expiry: "This link expires in 1 hour.",
		ignore:
			"If you did not request a password reset, you can safely ignore this email.",
	},
	ja: {
		subject: "パスワードをリセット",
		heading: "パスワードのリセット",
		body: "Note Nekoアカウントのパスワードリセットがリクエストされました。下のボタンをクリックして新しいパスワードを設定してください。",
		buttonText: "パスワードをリセット",
		expiry: "このリンクは1時間で有効期限が切れます。",
		ignore:
			"パスワードリセットをリクエストしていない場合は、このメールを無視しても問題ありません。",
	},
} as const;

function getTranslation(locale: string) {
	return locale in translations
		? translations[locale as keyof typeof translations]
		: translations.en;
}

export function passwordResetEmail({
	resetUrl,
	locale,
}: PasswordResetEmailOptions) {
	const t = getTranslation(locale);

	const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#18181b;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Note Neko</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 16px;color:#18181b;font-size:18px;font-weight:600;">${t.heading}</h2>
              <p style="margin:0 0 24px;color:#3f3f46;font-size:14px;line-height:1.6;">${t.body}</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${resetUrl}" style="display:inline-block;background-color:#18181b;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:8px;">${t.buttonText}</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#71717a;font-size:13px;">${t.expiry}</p>
              <p style="margin:0;color:#71717a;font-size:13px;">${t.ignore}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

	const text = `${t.heading}\n\n${t.body}\n\n${resetUrl}\n\n${t.expiry}\n\n${t.ignore}`;

	return { subject: t.subject, html, text };
}
