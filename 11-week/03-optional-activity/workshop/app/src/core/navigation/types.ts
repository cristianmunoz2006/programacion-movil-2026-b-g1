// See docs/01-architecture/navigation.md — mirrors the route registry there (5 routes total).
// AttendanceForm and AttendanceHistory get added here when those HUs are built — adding their
// types now, with no screen behind them, would be dead code.
export type RootStackParamList = {
  Login: undefined;
  StudentList: undefined;
  StudentDetail: { studentId: string };
};
