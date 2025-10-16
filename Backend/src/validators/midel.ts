import { validationResult } from "express-validator";
import type { Response,Request,NextFunction } from "express";

export function manejarErroresValidacion(req: Request, res: Response, next: NextFunction) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: "Datos inválidos",
      detalle: errores.array(),
    });
  }
  next();
}
