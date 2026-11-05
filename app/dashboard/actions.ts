"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, requireSession } from "@/lib/auth";
import { deleteDepartment as removeDepartment } from "@/lib/repositories/departments";
import { deleteEmployee as removeEmployee } from "@/lib/repositories/employees";

function recordId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    throw new Error("Invalid record id");
  }
  return id;
}

export async function logout() {
  await clearSession();
  redirect("/login");
}

export async function deleteEmployee(formData: FormData) {
  await requireSession();
  await removeEmployee(recordId(formData));
  revalidatePath("/dashboard");
}

export async function deleteDepartment(formData: FormData) {
  await requireSession();
  await removeDepartment(recordId(formData));
  revalidatePath("/dashboard");
}
