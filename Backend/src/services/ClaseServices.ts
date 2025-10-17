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
    const claseId = response.id;
    const entrenadorRef = this.db.collection("usuario").doc(data.entrenadorId);
    await entrenadorRef.update({
      clasesPropias: FieldValue.arrayUnion(claseId),
    });

    return claseId;
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
    const clasesId = this.db.collection("usuario").doc(userId);
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
    await clasesId.update({
      clasesId: FieldValue.arrayUnion(claseId),
    });
  };

  public quitarParticipante = async (
    claseId: string,
    userId: string
  ): Promise<void> => {
    const ref = this.db.collection(this.coleccionNombre).doc(claseId);
    const clasesId = this.db.collection("usuario").doc(userId);
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
    await clasesId.update({
      clasesId: FieldValue.arrayRemove(claseId),
    });
  };
  public obtenerClasesEntrenador = async (
    entrenadorId: string
  ): Promise<Array<{ id: string; nombre: string; horario: string; imagenClase: string }>> => {
    const usuarioRef = this.db.collection("usuario").doc(entrenadorId);
    const usuarioDoc = await usuarioRef.get();

    if (!usuarioDoc.exists) {
      throw new Error("Entrenador no encontrado");
    }

    const clasesPropias: string[] = usuarioDoc.data()?.clasesPropias || [];

    if (clasesPropias.length === 0) {
      return [];
    }

    const clasesPromises = clasesPropias.map(async (claseId) => {
      const claseDoc = await this.db.collection(this.coleccionNombre).doc(claseId).get();
      if (claseDoc.exists) {
        const data = claseDoc.data();
        return {
          id: claseDoc.id,
          nombre: data?.nombre || "",
          horario: data?.horario || "",
          imagenClase: data?.imagenClase || "",
        };
      }
      return null;
    });

    const clases = await Promise.all(clasesPromises);
    return clases.filter((clase) => clase !== null);
  };
  public obtenerClasesCliente = async (
    clienteId: string
  ): Promise<Array<{ id: string; nombre: string; horario: string; imagenClase: string }>> => {
    const usuarioRef = this.db.collection("usuario").doc(clienteId);
    const usuarioDoc = await usuarioRef.get();

    if (!usuarioDoc.exists) {
      throw new Error("Cliente no encontrado");
    }

    const clasesId: string[] = usuarioDoc.data()?.clasesId || [];

    if (clasesId.length === 0) {
      return [];
    }

    const clasesPromises = clasesId.map(async (claseId) => {
      const claseDoc = await this.db.collection(this.coleccionNombre).doc(claseId).get();
      if (claseDoc.exists) {
        const data = claseDoc.data();
        return {
          id: claseDoc.id,
          nombre: data?.nombre || "",
          horario: data?.horario || "",
          imagenClase: data?.imagenClase || "",
        };
      }
      return null;
    });

    const clases = await Promise.all(clasesPromises);
    return clases.filter((clase) => clase !== null);
  };
}
