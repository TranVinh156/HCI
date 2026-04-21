import { useAuth } from "../auth";
import { OverviewDashboard } from "../features/overview/OverviewDashboard";

const DEMO_FACULTY_ID = "it";

export function meta() {
  return [
    { title: "School Overview - The Insightful Lens" },
    {
      name: "description",
      content: "Thống kê chất lượng giảng dạy theo phạm vi nhà trường hoặc khoa viện.",
    },
  ];
}

export default function SchoolOverview() {
  const { user } = useAuth();
  const isFacultyScope = user?.role === "faculty";

  return (
    <OverviewDashboard
      mode={isFacultyScope ? "faculty" : "school"}
      lockedFacultyId={isFacultyScope ? DEMO_FACULTY_ID : undefined}
    />
  );
}
