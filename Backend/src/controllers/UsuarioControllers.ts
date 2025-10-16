import type { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import { Usuario } from "../models/Usuario.js";
import admin from "../config/dbFirebase.js";
const db = admin.firestore();

interface RequestUser extends Request {
  user: {
    uid: string;
    email: string;
    name?: string;
    picture?: string;
  };
}

export class UsuarioControllers {
  servicio = new UsuarioService(db, "usuario");

  public autenticarUsuario = async (req: Request, res: Response) => {
    const userUid = req as RequestUser;
    const user = userUid.user;

    const usuario = new Usuario(user.uid, user.email, user.name, user.picture);
    await this.servicio.guardar(usuario);
    res.status(200).json({
      mensaje: "Usuario autenticado y guardado",
    });
  };
  public obtenerUsuarioPorUid = async (req: Request, res: Response) => {
    try {
      const uid = req.params.uid;
      if (!uid) {
        return res.status(400).json({ error: "Falta el parámetro 'Uid'" });
      }
      const usuario = await this.servicio.obtener(uid);
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
