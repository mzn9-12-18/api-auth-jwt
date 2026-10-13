import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                msg: "Todos los campos son obligatorios"
            });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(409).json({
                msg: "El correo ya está registrado"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            msg: "Usuario registrado correctamente"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            msg: "Error al registrar el usuario"
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
    return res.status(400).json({
        msg: "El correo y la contraseña son obligatorios"
    });
}
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(404).json({
        msg: "Usuario no encontrado"
    });
}

    const isPasswordValid = await bcrypt.compare(
    password,
    user.password
);

if (!isPasswordValid) {
    return res.status(401).json({
        msg: "Credenciales incorrectas"
    });
}    

    const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);

return res.status(200).json({
    msg: "Inicio de sesión exitoso",
    token
});

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            msg: "Error al iniciar sesión"
        });
    }
};