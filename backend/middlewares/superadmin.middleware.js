import supabase from "../db/supabase.js";

export const superAdminMiddleware = async (req, res, next) => {
  try {
    console.log("ENTRA SuperAdminMiddleware");

    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select(`
        roles ( name )
      `)
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(403).json({
        error: "Acceso denegado, solo Super Administradores"
      });
    }

    const roleName = data.roles.name;

    if (roleName !== "super_admin") {
      return res.status(403).json({
        error: "Solo super_admin"
      });
    }

    req.userRole = roleName;

    next();

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};