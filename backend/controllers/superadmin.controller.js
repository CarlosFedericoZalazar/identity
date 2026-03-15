import { deleteUserService } from "../services/auth.service.js";

export const deleteUser = async (req,res) => {
    try{
        const idUser = req.params.id;
        const result = await deleteUserService(idUser);

        if (result && result.error) {
            return res.status(400).json({ error: result.error });
        }
        return res.status(200).json({ estado: "Ok, Usuario elimnado", data: result });
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
}