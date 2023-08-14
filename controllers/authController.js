require('dotenv').config();
const generateJWT = require('../helpers/generateJWT');
const generateTokenRandom = require('../helpers/generateTokenRandom');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const createError = require('http-errors');

const register = async (req, res) => {


    try {
        const { name, email, password } = req.body

        if ([name, email, password].includes("") || !name || !email || !password) {
            throw createError(400, "Todos los campos son obligatorios")
        }
        let user = await User.findOne({
            email
        })
        if (user) {
            throw createError(400, "El email ya se encuentra registrado")
        }

        user = new User(req.body);
        user.token = generateTokenRandom();
        const userStore = await user.save();

        console.log(userStore);
        //TODO ENVIAR EMAIL DE CONFIRMACION DE REGISTRO

        return res.status(201).json({
            ok: true,
            message: "Se enviara un mail para confirmar"
        })


    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Upss, hubo un error"
        })
    }


}
const login = async (req, res) => {

    try {
        console.log(req.body);
        const { email, password } = req.body;

        if ([email, password].includes("") || !email || !password) {
            throw createError(400, "Todos los campos son obligatorios")
        }
        let user = await User.findOne({
            email
        }).populate('favorites')
        if (!user) {
            throw createError(400, "Usuario inexistente")
        }
        if (await user.checkedPassword(password)) {
            return res.status(200).json({
                ok: true,
                token: generateJWT({
                    user: {
                        id: user._id,
                        name: user.name,
                        favorites: user.favorites ? user.favorites.map(favorite => favorite.drink) : []
                    }
                })
            })
        } else {
            throw createError(403, "Credenciales invalidas")
        }

    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Upss, Credenciales invalidas"
        })
    }



}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Verificar si el usuario existe en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(400, "El usuario con este correo electrónico no existe.");
        }
        // Generar un token de recuperación de contraseña (por ejemplo, un token aleatorio)
        const resetToken = generateTokenRandom();
        // Guardar el token de recuperación en el usuario
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora
        await user.save();
        // Configurar el transporte de Nodemailer con la configuración adecuada
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Utiliza la variable de entorno EMAIL_USER
                pass: process.env.EMAIL_PASSWORD // Utiliza la variable de entorno EMAIL_PASSWORD
            }
        });
        // Genera el enlace completo con el token en la URL
        const resetLink = `https://app-client-q8i7.vercel.app/update-password/${resetToken}`;
        // Configurar el contenido del correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER, // Tu dirección de correo electrónico
            to: email, // El correo electrónico del usuario que solicitó la recuperación de contraseña
            subject: 'Recuperación de contraseña',
            text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
            // Puedes personalizar el contenido del correo electrónico según tus necesidades.
            // También puedes enviar un correo electrónico en formato HTML.
        };
        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            ok: true,
            message: "Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.",
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Upss, hubo un error al solicitar la recuperación de contraseña.",
        });
    }
};
const updatePassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        // Verificar si el usuario existe en la base de datos a través del token
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            throw createError(400, "El token de restablecimiento de contraseña no es válido o ha expirado.");
        }
        // Restablecer la contraseña del usuario y eliminar el token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({
            ok: true,
            message: "Contraseña restablecida exitosamente.",
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Upss, hubo un error al restablecer la contraseña.",
        });
    }
};


module.exports = {
    register,
    login,
    forgotPassword,
    updatePassword, // Agrega el nuevo endpoint aquí
};

