"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { updateEmployee as save } from "@/lib/repositories/employees";
import { employeeSchema, formDataToObject } from "@/lib/validators";

export async function updateEmployee(id: number, formData: FormData) {
  await requireSession();
  const raw = formDataToObject(formData);
  const parsed = employeeSchema.safeParse({
    ...raw,
    departmentId: raw.departmentId ? raw.departmentId : null,
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid employee details");
  }

  await save(id, parsed.data);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
