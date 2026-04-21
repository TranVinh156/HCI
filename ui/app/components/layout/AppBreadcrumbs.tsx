import { Link } from "react-router";

type BreadcrumbItem = {
  label: string;
  to?: string;
};

function getBreadcrumbs(pathname: string, search: string): BreadcrumbItem[] {
  const classCode = new URLSearchParams(search).get("class")?.trim();

  if (pathname === "/") {
    return [{ label: "Class Management" }];
  }

  if (pathname === "/live") {
    return [
      { label: "Class Management", to: "/" },
      classCode ? { label: classCode } : null,
      { label: "Live Session" },
    ].filter(Boolean) as BreadcrumbItem[];
  }

  if (pathname === "/session-analytics") {
    return [
      { label: "Class Management", to: "/" },
      classCode ? { label: classCode } : null,
      { label: "Session Analytics" },
    ].filter(Boolean) as BreadcrumbItem[];
  }

  if (pathname === "/student-profiles") {
    return [
      { label: "Class Management", to: "/" },
      { label: "Student Profiles" },
    ];
  }

  if (pathname === "/ai-configuration") {
    return [
      { label: "Class Management", to: "/" },
      { label: "AI Configuration" },
    ];
  }

  if (pathname === "/school-overview") {
    return [{ label: "School Overview" }];
  }

  return [{ label: "Dashboard" }];
}

export function AppBreadcrumbs({
  pathname,
  search,
}: {
  pathname: string;
  search: string;
}) {
  const items = getBreadcrumbs(pathname, search);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-2">
              {index > 0 && <span className="text-slate-300">/</span>}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="truncate font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate font-semibold text-slate-900"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
