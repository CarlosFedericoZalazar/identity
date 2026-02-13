import express from 'express';
import cors from "cors";
import "dotenv/config";
import authRoutes from './routes/auth.route.js';

const app = express();

// 👇👇 ESTO SIEMPRE VA ANTES DE LAS RUTAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/auth', authRoutes);

app.listen("3000",()=>{
    console.log("Escuchando en puerto 3000");
})