type rol = "admin" | "usuario" | "entrenador";
type documento = "dni" | "pasaporte";
export interface Usuario {
  nombre: string;
  segundoNombre?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  documento: documento;
  imagenFace?: string;
  rol: rol;
};
