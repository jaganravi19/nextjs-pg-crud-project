import { requireSession } from "@/lib/auth";
import DepartmentForm from "../form";
import { saveDepartment } from "./actions";

export default async function NewDepartmentPage() {
  await requireSession();
  return <DepartmentForm action={saveDepartment} />;
}
