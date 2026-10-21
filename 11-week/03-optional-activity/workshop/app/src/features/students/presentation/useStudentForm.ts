import { useCallback, useState } from "react";
import { container } from "../../../core/di/container";
import { ConflictError } from "../../../core/errors";
import { strings } from "./strings";

// Exact shape from docs/01-architecture/features/students.md:
// StudentFormState { status: 'idle' | 'submitting' | 'success' | 'error', errorMessage?: string }
type StudentFormState = {
  status: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
  errorField?: "documentNumber";
};

export function useStudentForm(onSuccess: () => void) {
  const [state, setState] = useState<StudentFormState>({ status: "idle" });

  const submit = useCallback(
    async (name: string, documentNumber: string) => {
      setState({ status: "submitting" });
      try {
        await container.students.createStudent.execute(name, documentNumber);
        setState({ status: "success" });
        onSuccess();
      } catch (err) {
        if (err instanceof ConflictError) {
          setState({
            status: "error",
            errorMessage: strings.modal.duplicateDocumentError,
            errorField: "documentNumber",
          });
          return;
        }
        setState({ status: "error", errorMessage: strings.modal.genericError });
      }
    },
    [onSuccess]
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);

  return { state, submit, reset };
}