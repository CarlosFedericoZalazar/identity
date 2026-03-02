import supabase from "../db/supabase.js";

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, role_id, roles(name)")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    username: data.username,
    role: data.roles.name
  };
};

export const userActiveService = async (userId) => {
  return await supabase
    .from("users")
    .select("active")
    .eq("id", userId)
    .single();
};