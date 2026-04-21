export type ManagedClassStatus = "ONGOING" | "UPCOMING";

export type ManagedClass = {
  id: string;
  code: string;
  subject: string;
  room: string;
  schedule: string;
  studentCount: number;
  status: ManagedClassStatus;
  dayIndexes: number[];
  startMinutes: number;
  endMinutes: number;
};

export const ASSIGNED_CLASSES: ManagedClass[] = [
  {
    id: "class-ec402",
    code: "ECON-402",
    subject: "Advanced Macroeconomics",
    room: "204",
    schedule: "Mon, Wed 09:30 - 11:00",
    studentCount: 32,
    status: "ONGOING",
    dayIndexes: [1, 3],
    startMinutes: 9 * 60 + 30,
    endMinutes: 11 * 60,
  },
  {
    id: "class-st211",
    code: "STAT-211",
    subject: "Applied Statistics",
    room: "112",
    schedule: "Tue, Thu 13:15 - 14:45",
    studentCount: 28,
    status: "UPCOMING",
    dayIndexes: [2, 4],
    startMinutes: 13 * 60 + 15,
    endMinutes: 14 * 60 + 45,
  },
  {
    id: "class-ba305",
    code: "BA-305",
    subject: "Business Analytics Lab",
    room: "A3",
    schedule: "Fri 08:00 - 10:30",
    studentCount: 24,
    status: "UPCOMING",
    dayIndexes: [5],
    startMinutes: 8 * 60,
    endMinutes: 10 * 60 + 30,
  },
  {
    id: "class-fi320",
    code: "FIN-320",
    subject: "Corporate Finance",
    room: "305",
    schedule: "Tue 08:30 - 11:00",
    studentCount: 36,
    status: "UPCOMING",
    dayIndexes: [2],
    startMinutes: 8 * 60 + 30,
    endMinutes: 11 * 60,
  },
];

export function getAssignedClassByCode(classCode: string) {
  return ASSIGNED_CLASSES.find((item) => item.code === classCode) ?? ASSIGNED_CLASSES[0];
}
