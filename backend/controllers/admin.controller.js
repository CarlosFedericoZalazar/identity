import supabase from "../db/supabase.js";

export const getUsers = async (req, res) => {
  try {
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
    }));

    res.json(formattedUsers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};