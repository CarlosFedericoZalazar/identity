import supabase from "../db/supabase.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select(`
        roles ( name )
      `)
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    if (data.roles.name !== "admin") {
      return res.status(403).json({ error: "Solo administradores" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};