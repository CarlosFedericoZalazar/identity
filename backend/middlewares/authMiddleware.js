import supabase from "../db/supabase.js";

// Mediante este middleware me doy cuanta el token es válido y es de este usuario (data.user)
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // SOLO identidad
    req.user = data.user;

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

