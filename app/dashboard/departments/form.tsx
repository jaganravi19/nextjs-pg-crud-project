import Link from "next/link";

type DepartmentFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  department?: { name: string; description: string | null };
};

export default function DepartmentForm({ action, department }: DepartmentFormProps) {
  return (
    <main className="wrap">
      <section className="card">
        <h1>{department ? "Edit department" : "Add department"}</h1>
        <p className="muted">Department names must be unique.</p>
        <form action={action} className="stack form-narrow">
          <label className="field">
            Name
            <input name="name" defaultValue={department?.name} required maxLength={100} />
          </label>
          <label className="field">
            Description
            <textarea name="description" rows={4} defaultValue={department?.description ?? ""} maxLength={500} />
          </label>
          <div className="actions">
            <button>Save department</button>
            <Link className="button secondary" href="/dashboard">Cancel</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
