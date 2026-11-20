const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

// Convierte '2026-10-18' en '18 de octubre de 2026'.
// Si el texto no tiene ese formato, lo devuelve igual.
export function fechaLegible(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  if (!anio || !dia || !mes || mes < 1 || mes > 12) return fecha;
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}
