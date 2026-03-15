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
};

export const resetPasswordUserService = async (userId, tempPassword) =>{
  await supabase.auth.admin.updateUserById(userId, {
  password: tempPassword
});
};

export const updateUserService = async (id, full_name, role, state) => {
  if (!id) throw new Error("Se requiere id de usuario");

  const updates = {};
  if (typeof full_name !== "undefined") updates.full_name = full_name;
  updates.active = state;

  if (typeof role !== "undefined") {
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", role)
      .single();

    if (roleError || !roleData) {
      throw new Error("No se pudo obtener el rol");
    }
    updates.role_id = roleData.id;
  }
  if (Object.keys(updates).length) {
    const { error: profileError } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id);

    if (profileError) {
      throw new Error("No se pudo actualizar el perfil");
    }
  }
  return {
    id,
    full_name: updates.full_name ?? null,
    role: typeof role !== "undefined" ? role : null,
    state: typeof state !== "undefined" ? state : null
  };
};

export const deleteUserService = async (id) => {

    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
    throw new Error("No se pudo eliminar el usuario de auth");
    }
    
    return {
      id,
      deleted: true
    };
};