import supabase from "../db/supabase.js";

export const superAdminMiddleware = async (token) => {
    try {
    console.log("ENTRA Super AdminMiddleware");
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select(`
        roles ( name )
      `)
      .eq("id", userId)
      .single();

    if (error || !data) {
      return res.status(403).json({ error: "Acceso denegado, Solo Super Administradores" });
    }

    const roleName = data.roles.name;
    
    if (data.roles.name !== "super_admin") {
      return res.status(403).json({ error: "Solo administradores" });
    }
    console.log("DATA COMPLETA:", data);
    req.userRole = roleName;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};