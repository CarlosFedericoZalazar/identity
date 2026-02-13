import supabase from "../db/supabase.js";

export const createUserService = async (email, password, full_name) => {

  // 1️⃣ Crear usuario en Supabase Auth
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

  // 2️⃣ Buscar el rol "user"
  const { data: roleData, error: roleError } =
    await supabase
      .from("roles")
      .select("id")
      .eq("name", "user")
      .single();

  if (roleError) {
    throw new Error("No se pudo obtener el rol");
  }

  // 3️⃣ Crear perfil
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

  // 4️⃣ Devolver usuario limpio
  return {
    id: userId,
    email,
    full_name,
    role: "user"
  };
};

export const loguinUserService = async (email, password)=>{
  const {data, error} = await supabase.auth.signInWithPassword({ email, password });
  return {data, error};
}