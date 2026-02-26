import supabase from "../db/supabase.js";

export const createUserService = async (email, password, full_name, profile) => {
  // Crear usuario en Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user.id;

  try {
    // buscamos el id del rol recibido como parametro profile
    const { data: roleData, error: roleError } =
      await supabase
        .from("roles")
        .select("id")
        .eq("name", profile)
        .single();

    if (roleError || !roleData) {
      throw new Error("No se pudo obtener el rol");
    }

    // creamos perfil
    const { error: profileError } =
      await supabase
        .from("users")
        .insert({
          id: userId,
          full_name,
          role_id: roleData.id
        });

    if (profileError) {
      throw new Error("No se pudo crear el perfil");
    }

    // retornamos el usuario
    return {
      id: userId,
      email,
      full_name,
      role: profile
    };

  } catch (error) {

    // borramos usuario recien creado ante el error
    await supabase.auth.admin.deleteUser(userId);

    throw error;
  }
};

export const loguinUserService = async (email, password)=>{
  const {data, error} = await supabase.auth.signInWithPassword({ email, password });
  return {data, error};
}