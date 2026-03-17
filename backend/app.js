import express from 'express';
import cors from "cors";
import "dotenv/config";
import authRoutes from './routes/auth.route.js';
import adminRoutes from "./routes/admin.route.js";
import superAdminRoutes from "./routes/superadmin.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/api/auth', authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/super-admin", superAdminRoutes);

export default app;