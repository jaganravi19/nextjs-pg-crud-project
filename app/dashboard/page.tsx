import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { countEmployees, listEmployees } from "@/lib/repositories/employees";
import { listDepartments } from "@/lib/repositories/departments";
import { deleteDepartment, deleteEmployee, logout } from "./actions";

const PAGE_SIZE = 10;

type DashboardProps = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export default async function Dashboard({ searchParams }: DashboardProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const query = await searchParams;
  const search = (query.q ?? "").trim().slice(0, 100);
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? Math.max(requestedPage, 1) : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const [employeeResult, departments, total] = await Promise.all([
    listEmployees({ search, limit: PAGE_SIZE, offset }),
    listDepartments(),
    countEmployees(search),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);

  return (
    <main className="wrap">
      <header className="top">
        <div>
          <h1>PeopleDesk</h1>
          <p className="muted">Signed in as {session.email}</p>
        </div>
        <form action={logout}>
          <button className="secondary">Sign out</button>
        </form>
      </header>

      <div className="stack">
        <section className="card">
          <div className="top">
            <div>
              <h2>Employees</h2>
              <span className="muted">{total} people</span>
            </div>
            <Link className="button" href="/dashboard/employees/new">
              Add employee
            </Link>
          </div>

          <form className="toolbar" method="get">
            <label className="sr-only" htmlFor="employee-search">
              Search employees
            </label>
            <input
              id="employee-search"
              name="q"
              defaultValue={search}
              maxLength={100}
              placeholder="Search name, email, or role"
            />
            <button className="secondary">Search</button>
            {search && <Link href="/dashboard">Clear</Link>}
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Job title</th><th>Department</th>
                  <th>Email</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeResult.rows.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.first_name} {employee.last_name}</td>
                    <td>{employee.job_title}</td>
                    <td>{employee.department_name ?? "—"}</td>
                    <td>{employee.email}</td>
                    <td><span className={`badge ${employee.status === "inactive" ? "off" : ""}`}>{employee.status}</span></td>
                    <td>
                      <div className="actions">
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>Edit</Link>
                        <form action={deleteEmployee}>
                          <input type="hidden" name="id" value={employee.id} />
                          <button className="danger">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {employeeResult.rows.length === 0 && (
                  <tr><td colSpan={6} className="muted">No employees found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <nav className="pager" aria-label="Employee pages">
            <span className="muted">Page {currentPage} of {pageCount}</span>
            {currentPage > 1 && <Link href={pageHref(search, currentPage - 1)}>Previous</Link>}
            {currentPage < pageCount && <Link href={pageHref(search, currentPage + 1)}>Next</Link>}
          </nav>
        </section>

        <section className="card">
          <div className="top">
            <div><h2>Departments</h2><span className="muted">Organize your team</span></div>
            <Link className="button" href="/dashboard/departments/new">Add department</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td>{department.name}</td><td>{department.description || "—"}</td>
                    <td>
                      <div className="actions">
                        <Link href={`/dashboard/departments/${department.id}/edit`}>Edit</Link>
                        <form action={deleteDepartment}>
                          <input type="hidden" name="id" value={department.id} />
                          <button className="danger">Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && <tr><td colSpan={3} className="muted">No departments yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function pageHref(search: string, page: number) {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("q", search);
  return `/dashboard?${params.toString()}`;
}
