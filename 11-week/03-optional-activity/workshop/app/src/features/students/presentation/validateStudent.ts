import { strings } from "./strings";

// Reglas del dominio (data-model.md, entidad Student): name y documentNumber no pueden
// quedar vacíos después de quitar los espacios. La unicidad del documento la valida el servidor.
export function validateName(value: string): string | undefined {
  return value.trim().length === 0 ? strings.modal.nameRequired : undefined;
}

export function validateDocumentNumber(value: string): string | undefined {
  return value.trim().length === 0 ? strings.modal.documentRequired : undefined;
}
