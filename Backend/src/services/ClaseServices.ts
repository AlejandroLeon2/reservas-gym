import { Firestore } from "firebase-admin/firestore";
import type { clase } from "../interface/Clase.ts";
import { FieldValue } from "firebase-admin/firestore";

export class ClaseService {
  constructor(private db: Firestore, public coleccionNombre: string) {}
  public crear = async (data: clase): Promise<string> => {
    const dataClase = { ...data, participantesId: [] };
    const response = await this.db
      .collection(this.coleccionNombre)
      .add(dataClase);
    return response.id;
  };
  public traerTodas = async (): Promise<clase[]> => {
    const snapshot = await this.db.collection(this.coleccionNombre).get();
    const clases = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as clase[];

    return clases;
  };
  public actualizar = async (
    id: string,
    data: Partial<clase>
  ): Promise<void> => {
    await this.db.collection(this.coleccionNombre).doc(id).update(data);
  };

  public eliminar = async (id: string): Promise<void> => {
    await this.db.collection(this.coleccionNombre).doc(id).delete();
  };

  public agregarParticipante = async (
    claseId: string,
    userId: string
  ): Promise<void> => {
    const ref = this.db.collection(this.coleccionNombre).doc(claseId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Clase no encontrada");

    const data = doc.data();
    const participantes: string[] = data?.participantesId || [];
    const cuposDisponibles: number = data?.cuposDisponibles ?? 0;

    if (participantes.includes(userId)) return;
    if (cuposDisponibles <= 0) throw new Error("No hay cupos disponibles");

    await ref.update({
      participantesId: FieldValue.arrayUnion(userId),
      cuposDisponibles: cuposDisponibles - 1,
    });
  };

  public quitarParticipante = async (
    claseId: string,
    userId: string
  ): Promise<void> => {
    const ref = this.db.collection(this.coleccionNombre).doc(claseId);
    const doc = await ref.get();

    if (!doc.exists) throw new Error("Clase no encontrada");

    const data = doc.data();
    const participantes: string[] = data?.participantesId || [];
    const cuposDisponibles: number = data?.cuposDisponibles ?? 0;

    if (!participantes.includes(userId)) return;

    await ref.update({
      participantesId: FieldValue.arrayRemove(userId),
      cuposDisponibles: cuposDisponibles + 1,
    });
  };
}
