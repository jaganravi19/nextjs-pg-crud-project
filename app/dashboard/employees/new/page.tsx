import { requireSession } from "@/lib/auth";
import { listDepartments } from "@/lib/repositories/departments";
import EmployeeForm from "../form";
import { saveEmployee } from "./actions";

export default async function NewEmployeePage() {
  await requireSession();
  const departments = await listDepartments();
  return <EmployeeForm action={saveEmployee} depts={departments} />;
}
