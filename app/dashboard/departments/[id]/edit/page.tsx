import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDepartment } from "@/lib/repositories/departments";
import DepartmentForm from "../../form";
import { updateDepartment } from "./actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditDepartmentPage({ params }: PageProps) {
  await requireSession();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const department = await getDepartment(id);
  if (!department) notFound();

  return (
    <DepartmentForm
      action={updateDepartment.bind(null, id)}
      department={department}
    />
  );
}
