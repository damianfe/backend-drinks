const createError = require('http-errors');
const Favorite = require('../models/Favorite');
const User = require('../models/User');

const profile = async (req, res) => {
    return res.status(200).json({
        ok: true,
        user: req.user


    })
}

const toggleFavorite = async (req, res) => {
    try {
        if (!req.user) {
            throw createError(401, "No estás autorizado")
        }
        const user = await User.findById(req.user.id).populate('favorites')
        const { drink } = req.query

        if (!drink) {
            throw createError(400, "Se requiere el ID de la bebida")
        }
        //console.log(req.user.favorites)

        if (!user.favorites.map(favorite => favorite.drink).includes(drink)) {
            const favoriteStore = await Favorite.create({
                drink,
                user
            });
            user.favorites.push(favoriteStore._id)
            await user.save()
        } else {
            const favorite = await Favorite.findOne({
                drink,
                user
            });

            if (favorite) {
                await favorite.deleteOne();
                const favoritesUpdate = user.favorites.filter(fav => fav.drink !== drink)

                user.favorites = favoritesUpdate
                await user.save();
            } else {

                throw createError(404, "El favorito no existe para este usuario");
            }
        }

        return res.status(200).json({
            data: user.favorites
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Upss, Credenciales invalidas"
        })
    }
}

module.exports = {
    profile,
    toggleFavorite
}