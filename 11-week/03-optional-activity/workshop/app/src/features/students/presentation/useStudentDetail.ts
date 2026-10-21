import { useCallback, useEffect, useState } from "react";
import { container } from "../../../core/di/container";
import { Student } from "../domain/Student";

type StudentDetailState =
  | { status: "loading" }
  | { status: "loaded"; student: Student; isOffline: boolean }
  | { status: "notFound" }
  | { status: "error" };

// Estados de docs/01-architecture/screens/student-detail.md. No hay estado vacío: solo se
// llega al detalle de un estudiante que existe, salvo que el id ya no esté en los datos.
export function useStudentDetail(studentId: string) {
  const [state, setState] = useState<StudentDetailState>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const { student, fromCache } = await container.students.getStudentById.execute(studentId);
      setState(student ? { status: "loaded", student, isOffline: fromCache } : { status: "notFound" });
    } catch {
      setState({ status: "error" });
    }
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
