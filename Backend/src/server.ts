
import express from 'express';
import cors from 'cors';
import usuario from './routes/usuarioRoutes.js';
import claseRoutes from './routes/claseRoutes.js'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/v1",claseRoutes );
app.use("/v1",usuario );
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto: http://localhost:${PORT}`);
});
