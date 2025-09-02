export interface Alumno {
  id: number;
  codAlumno: string;
  nombreCompleto: string;
  dni: string;
  grado: string;
  seccion: string;
  nivel: string | null;
  responsablePago: string;
  telefonoTutor: string;
  emailTutor: string;
  direccion: string;
}
