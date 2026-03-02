import supabase from "../db/supabase.js";

export const getUsers = async (req, res) => {
  try {
    console.log("ROL DEL QUE CONSULTA:", req.userRole);

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        full_name,
        roles ( name )
      `);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const formattedUsers = data.map(user => ({
      id: user.id,
      full_name: user.full_name,
      role: user.roles.name
    })).filter(user =>user.role === "user");
    
    res.json(formattedU);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};