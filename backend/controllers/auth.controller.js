// 1. crear usuario en auth
// 2. obtener id
// 3. buscar role_id
// 4. insertar perfil

import { createUserService } from "../services/auth.service.js";

export const register = async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    const user = await createUserService(email, password, full_name);

    res.status(201).json({
      ok: true,
      user
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message
    });
  }
};