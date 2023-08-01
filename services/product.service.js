const Products = require('../models/Products')
const Favorite = require('../models/Favorite')


const getWhiskysService = async (req, res) => {
    try {
        const regex = new RegExp('whisky', 'i')
        const wiskyes = await Products.find({ name: regex });

        return res.status(200).json({
            ok: true,
            wiskyes
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Error al obtener los wisky"
        })
    }

}
const getVinosService = async (req, res) => {
    try {
        const regex = new RegExp('vino', 'i')
        const vinos = await Products.find({ name: regex });

        return res.status(200).json({
            ok: true,
            vinos
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Error al obtener las vinos"
        })
    }

}
const getFavoriteDrinkService = async (req, res) => {
    try {
        const { id } = req.body

        const favoriteData = await Favorite.findById(id)
        return res.status(200).json({
            ok: true,
            favoriteData
        })


    } catch (error) {
        return res.status(error.status || 500).json({
            ok: false,
            message: error.message || "Ocurrió un error"
        })
    }
}

module.exports = {
    getFavoriteDrinkService,
    getWhiskysService,
    getVinosService
}