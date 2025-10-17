import { ClaseControllers } from "../controllers/ClaseControllers.js";
import { validarClase } from "../validators/claseValidator.js";
import { manejarErroresValidacion } from "../validators/midel.js";
import { Router } from "express";

const router = Router();
const controllers = new ClaseControllers();

router.post(
  "/clase",
  validarClase,
  manejarErroresValidacion,
  controllers.crearClase
);
router.get("/clase/entrenador/:entrenadorId", controllers.obtenerClasesEntrenador);

router.get("/clase/cliente/:clienteId", controllers.obtenerClasesCliente);

router.get("/clase", controllers.obtenerClases);

router.put("/clase/:id", controllers.actualizarClase);

router.delete("/clase/:id", controllers.eliminarClase);

router.post("/clase/:claseId/registrar/:userId", controllers.registrarUsuario);

router.delete("/clase/:claseId/participante/:userId", controllers.eliminarUsuario);

export default router;
