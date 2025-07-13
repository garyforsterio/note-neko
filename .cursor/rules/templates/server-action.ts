"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { redirect } from "#i18n/navigation";
import { parseWithZod } from "@conform-to/zod";

const schema = z.object({
	// Add validation schema
});

export async function actionName(lastResult: unknown, formData: FormData) {
	try {
		const submission = parseWithZod(formData, { schema });

		if (submission.status !== "success") {
			return submission.reply();
		}

		// Process data here
		await someDatabaseOperation(submission.value);
		revalidateTag("path");
		redirect({
			href: "/success",
			locale: "en",
		});
	} catch (error) {
		return submission.reply({
			formErrors: [t("error.generic")],
		});
	}
}
