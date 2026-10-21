import { apiFetch } from "../../../core/network/apiFetch";
import { cache } from "../../../core/storage/cache";
import { NetworkError } from "../../../core/errors";
import { Student } from "../domain/Student";
import { StudentRepository } from "../domain/StudentRepository";

// See docs/03-api-and-data/offline-sync.md (read-through cache) and
// docs/03-api-and-data/persistence.md (cache:students:list key).
export class StudentRepositoryImpl implements StudentRepository {
  async getStudents(): Promise<{ students: Student[]; fromCache: boolean }> {
    // Solo para probar los estados de la lista: ver .env.example.
    const simulatedDelay = Number(process.env.EXPO_PUBLIC_SIM_DELAY_MS ?? 0);
    if (simulatedDelay > 0) await new Promise((resolve) => setTimeout(resolve, simulatedDelay));
    if (process.env.EXPO_PUBLIC_SIM_LIST === "error") throw new NetworkError("Falla simulada");
    if (process.env.EXPO_PUBLIC_SIM_LIST === "empty") return { students: [], fromCache: false };

    try {
      const students = await apiFetch<Student[]>("/students");
      await cache.set(cache.keys.studentsList, students);
      return { students, fromCache: false };
    } catch (err) {
      // Fall back to cache only on a network-ish failure — a validation/auth error should
      // still surface normally, it's not "we're offline."
      if (err instanceof NetworkError) {
        const cached = await cache.get<Student[]>(cache.keys.studentsList);
        if (cached) return { students: cached, fromCache: true };
      }
      throw err;
    }
  }

  async getStudentById(id: string): Promise<{ student: Student | null; fromCache: boolean }> {
    // Solo para probar los estados del detalle: EXPO_PUBLIC_SIM_DETAIL = "error" o "notfound".
    if (process.env.EXPO_PUBLIC_SIM_DETAIL === "error") throw new NetworkError("Falla simulada");

    // El backend aún no tiene GET /students/:id (E-04), así que se busca en la lista.
    const { students, fromCache } = await this.getStudents();
    if (process.env.EXPO_PUBLIC_SIM_DETAIL === "notfound") return { student: null, fromCache };
    return { student: students.find((student) => student.id === id) ?? null, fromCache };
  }

  async createStudent(name: string, documentNumber: string): Promise<Student> {
    // Solo para probar el indicador de carga del formulario: ver .env.example.
    await new Promise((resolve) => setTimeout(resolve, Number(process.env.EXPO_PUBLIC_SIM_DELAY_MS ?? 0)));
    // No offline queue — see docs/03-api-and-data/offline-sync.md. If this fails, it fails;
    // the screen shows the error, it is never queued to retry automatically.
    return apiFetch<Student>("/students", {
      method: "POST",
      body: { name, documentNumber },
    });
  }
}
