import { ClaseService } from "../services/ClaseServices.js";
import type { Response, Request } from "express";
import admin from "../config/dbFirebase.js";
const db = admin.firestore();

export class ClaseControllers {
  private servicio = new ClaseService(db, "clase");

  public crearClase = async (req: Request, res: Response) => {
    try {
      const id = await this.servicio.crear(req.body);
      res.status(201).json({ id });
    } catch (error: unknown) {
      console.error("Error al crear la clase", error);
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      res.status(500).json({
        error: "No se pudo crear la clase",
        detalle: mensaje,
      });
    }
  };
  public obtenerClases = async (_req: Request, res: Response) => {
    try {
      const clases = await this.servicio.traerTodas();
      res.status(200).json(clases);
    } catch (error: unknown) {
      console.error("Error al obtener las clases", error);
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      res
        .status(500)
        .json({ error: "No se pudieron obtener las clases", detalle: mensaje });
    }
  };
  public actualizarClase = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Falta el parámetro 'id'" });
      }

      await this.servicio.actualizar(id, req.body);
      res.status(200).json({ mensaje: "Clase actualizada correctamente" });
    } catch (error: unknown) {
      console.error("Error al actualizar la clase", error);
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      res
        .status(500)
        .json({ error: "No se pudo actualizar la clase", detalle: mensaje });
    }
  };
  public eliminarClase = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Falta el parámetro 'id'" });
      }
      await this.servicio.eliminar(id);

      res.status(200).json({ mensaje: "Clase eliminada correctamente" });
    } catch (error: unknown) {
      console.error("Error al eliminar la clase", error);
      const mensaje =
        error instanceof Error ? error.message : "Error desconocido";
      res
        .status(500)
        .json({ error: "No se pudo eliminar la clase", detalle: mensaje });
    }
  };
    public registrarUsuario = async (req: Request, res: Response) => {
    const { claseId, userId } = req.params;
    if (!claseId || !userId) {
      return res.status(400).json({ error: "Faltan parámetros 'claseId' o 'userId'" });
    }

    try {
      await this.servicio.agregarParticipante(claseId, userId);
      res.status(200).json({ mensaje: "Usuario registrado en la clase" });
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : "Error desconocido";
      res.status(500).json({ error: "No se pudo registrar al usuario", detalle: mensaje });
    }
  };
    public eliminarUsuario = async (req: Request, res: Response) => {
    const { claseId, userId } = req.params;
    if (!claseId || !userId) {
      return res.status(400).json({ error: "Faltan parámetros 'claseId' o 'userId'" });
    }

    try {
      await this.servicio.quitarParticipante(claseId, userId);
      res.status(200).json({ mensaje: "Usuario eliminado de la clase" });
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : "Error desconocido";
      res.status(500).json({ error: "No se pudo eliminar al usuario", detalle: mensaje });
    }
  };
}
