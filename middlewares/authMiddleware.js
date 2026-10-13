import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      msg: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "Token no proporcionado",
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET no está configurado");

    return res.status(500).json({
      msg: "Error interno del servidor",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "El token ha expirado",
      });
    }

    return res.status(401).json({
      msg: "Token inválido",
    });
  }
};