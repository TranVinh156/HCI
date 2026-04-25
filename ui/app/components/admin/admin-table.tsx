import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
};

type AdminTableProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
};

export function AdminTable<T>({ title, columns, data }: AdminTableProps<T>) {
  return (
    <section className="rounded-xl border border-sky-100 bg-white shadow-sm">
      <div className="border-b border-sky-100 p-4">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
      </div>
      <Table className="min-w-[42rem]">
        <TableHeader className="bg-sky-50 text-xs uppercase text-slate-500">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="px-4 py-3 font-black">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-sky-50/50">
              {columns.map((column) => (
                <TableCell key={column.key} className="px-4 py-3 font-semibold">
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
