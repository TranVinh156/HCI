import { Mail, Plus, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminShell } from "~/components/admin/admin-shell";
import { AdminTable } from "~/components/admin/admin-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { profiles } from "~/lib/learning-data";

const studentRows = profiles.map((profile, index) => ({
  ...profile,
  className: index === 0 ? "Ocean A" : index === 1 ? "Ocean B" : "Starter",
  completed: index === 0 ? 8 : index === 1 ? 5 : 3,
  accuracy: index === 0 ? "92%" : index === 1 ? "81%" : "76%",
  status: index === 2 ? "Needs support" : "On track",
}));

export default function AdminStudentsRoute() {
  const [query, setQuery] = useState("");
  const filteredStudents = useMemo(
    () =>
      studentRows.filter((student) =>
        `${student.name} ${student.guardian} ${student.className}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AdminShell title="Students" subtitle="Profiles and progress">
      <div className="space-y-5">
        <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
          <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-black">Student roster</h2>
              <p className="text-sm font-semibold text-slate-500">
                Manage mock learner profiles, guardians, and class placement.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search students..."
                  className="h-11 pl-9 sm:w-72"
                />
              </div>
              <Button className="h-11 rounded-xl font-black">
                <Plus className="size-4" />
                Add student
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <ShieldCheck className="size-7 text-emerald-600" />
              <p className="mt-3 text-3xl font-black">2</p>
              <p className="text-sm font-bold text-slate-500">On track</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <Mail className="size-7 text-cyan-600" />
              <p className="mt-3 text-3xl font-black">3</p>
              <p className="text-sm font-bold text-slate-500">Guardian links</p>
            </CardContent>
          </Card>
          <Card className="rounded-xl border-sky-100 py-0 shadow-sm">
            <CardContent className="p-5">
              <Search className="size-7 text-amber-600" />
              <p className="mt-3 text-3xl font-black">1</p>
              <p className="text-sm font-bold text-slate-500">Needs review</p>
            </CardContent>
          </Card>
        </div>

        <AdminTable
          title="Student list"
          data={filteredStudents}
          columns={[
            { key: "name", header: "Name", render: (item) => item.name },
            { key: "age", header: "Age", render: (item) => item.age },
            {
              key: "guardian",
              header: "Guardian",
              render: (item) => item.guardian,
            },
            {
              key: "class",
              header: "Class",
              render: (item) => item.className,
            },
            {
              key: "completed",
              header: "Lessons done",
              render: (item) => item.completed,
            },
            {
              key: "accuracy",
              header: "Accuracy",
              render: (item) => item.accuracy,
            },
            {
              key: "status",
              header: "Status",
              render: (item) => (
                <Badge
                  className={
                    item.status === "On track"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }
                >
                  {item.status}
                </Badge>
              ),
            },
          ]}
        />
      </div>
    </AdminShell>
  );
}
