import { Student } from "./Student";
import { StudentRepository } from "./StudentRepository";

export class GetStudentById {
  constructor(private repository: StudentRepository) {}

  execute(id: string): Promise<{ student: Student | null; fromCache: boolean }> {
    return this.repository.getStudentById(id);
  }
}
