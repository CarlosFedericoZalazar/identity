import supabase from "../db/supabase.js";
import { createUserService, resetPasswordUserService, updateUserService } from "../services/auth.service.js";

export const getUsers = async (req, res) => {
  console.log("estoy en el getUser");

  try {
    console.log("ROL DEL QUE CONSULTA:", req.userRole);

    let query = supabase
      .from("users")
      .select(`
    id,
    full_name,
    roles!inner ( name ),
    active`);

    if (req.userRole === "super_admin") {
      query = query.in("roles.name", ["user", "admin"]);
    } else if (req.userRole === "admin") {
      query = query.eq("roles.name", "user");
    }

    const { data, error } = await query;

    if (error) {
      console.log("ERROR SUPABASE:", error);
      return res.status(500).json({ error: error.message });
    }

    const formattedUsers = data.map(user => ({
      id: user.id,
      full_name: user.full_name,
      role: user.roles.name,
      state: user.active
    }));
    console.log(formattedUsers);
    res.json(formattedUsers);

  } catch (error) {
    console.log("ERROR EN getUsers:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, full_name, profile } = req.body;

    const newUser = await createUserService(
      email,
      password,
      full_name,
      profile
    );

    res.status(201).json({
  message: "Usuario creado correctamente",
  user: newUser
});

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordUser = async (req, res) => {
  try {

    const idUser = req.params.id;
    const tempPassword = "temp1234!";

    await resetPasswordUserService(idUser, tempPassword);

    res.status(200).json({
      message: "Password reseteada correctamente",
      temporaryPassword: tempPassword
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { full_name, role, state } = req.body;

    const result = await updateUserService(id, full_name, role, state);

    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({ estado: "ok", data: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};