// 1. crear usuario en auth
// 2. obtener id
// 3. buscar role_id
// 4. insertar perfil

import { createUserService, loguinUserService } from "../services/auth.service.js";

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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await loguinUserService(email, password);

    if (error) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales inválidas"
      });
    }

    return res.status(200).json({
      ok: true,
      session: data.session,
      user: data.user
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}

export const getProfile = async (req, res) => {
  try {
    // Viene del token
    const user = req.user;

    return res.status(200).json({
      ok: true,
      message: "Perfil obtenido",
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};

