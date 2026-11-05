import { notFound, redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { listDepartments } from "@/lib/repositories/departments";
import { getEmployee } from "@/lib/repositories/employees";
import EmployeeForm from "../../form";
import { updateEmployee } from "./actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditEmployeePage({ params }: PageProps) {
  await requireSession();
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  const [employee, departments] = await Promise.all([
    getEmployee(id),
    listDepartments(),
  ]);
  if (!employee) notFound();

  return (
    <EmployeeForm
      action={updateEmployee.bind(null, id)}
      employee={employee}
      depts={departments}
    />
  );
}
