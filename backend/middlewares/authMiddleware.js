import supabase from "../db/supabase.js";

// Mediante este middleware me doy cuanta el token es válido y es de este usuario (data.user)
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token" });
    }
    
    const token = authHeader.split(" ")[1];
    
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: "Token inválido" });
    }
    
    // SOLO identidad
    req.user = data.user;
    console.log(`authMiddleware: req.user -> ${req.user.profile}`);
    console.log(data);

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isActiveMiddleware = async (req, res, next) => {
  try {
    console.log("ENTRA isActiveMiddleware");
    const userId = req.user.id; // ← ya viene del authMiddleware

    const { data, error } = await supabase
      .from("users")
      .select("active")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(500).json({ error: "DB error" });
    }

    if (!data?.active) {
      return res.status(403).json({
        error: "account_disabled",
        message: "Tu cuenta está desactivada."
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};