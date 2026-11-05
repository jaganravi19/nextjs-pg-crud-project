"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { updateDepartment as save } from "@/lib/repositories/departments";
import { departmentSchema, formDataToObject } from "@/lib/validators";

export async function updateDepartment(id: number, formData: FormData) {
  await requireSession();
  const parsed = departmentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid department details");
  }
  await save(id, parsed.data);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
