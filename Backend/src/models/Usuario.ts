export class Usuario {
  constructor(
    public uid: string,
    public email: string,
    public nombre?: string,
    public foto?: string,
    public rol: 'cliente' | 'entrenador' = 'cliente',
    public clasesId: string[] = []
  ) {}

  toFirestore() {
    return {
      email: this.email,
      nombre: this.nombre || null,
      foto: this.foto || null,
      rol: this.rol,
      lastLogin: new Date(),
      clasesId:this.clasesId
    };
  }
}
