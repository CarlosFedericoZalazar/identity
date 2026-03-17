import express from 'express';
import cors from "cors";
import "dotenv/config";
import authRoutes from './routes/auth.route.js';
import adminRoutes from "./routes/admin.route.js";
import superAdminRoutes from "./routes/superadmin.routes.js";

const app = express();

// 👇👇 ESTO SIEMPRE VA ANTES DE LAS RUTAS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "http://localhost:5500",
    "https://identity-frontend-flax.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

app.use('/api/auth', authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/super-admin", superAdminRoutes);

export default app;