const { getFavoriteDrinkService } = require("../services/product.service")
const Products = require('../models/Products')


const getFavoriteDrink = async (req,res) =>{
try {
  const {id} = req.body

  let drink = await getFavoriteDrinkService(id);
  return res.status(201).json({
    ok: true,
    message: 'Drink encontrado'
   
  })
} catch (error)  {
  return res.status(error.status || 500).json({
      ok: false,
      message: error.message || "Ocurrió un error"
  })
}
  
   
}


const getWhisky = async (req, res) => {
  try {
      const regex = new RegExp('whisky', 'i')
      const whiskyes = await Products.find({ name: regex });
    
      return res.status(200).json({
          ok: true,
          whiskyes
      })
      } catch (error) {
          return res.status(error.status || 500).json({
              ok: false,
              message: error.message || "Error  al traer los Whisky"
          })
      }

  }
  const getVinos = async (req, res) => {
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
      const getLicors = async (req, res) => {
        try {
            const regex = new RegExp('licor', 'i')
            const licors = await Products.find({ name: regex });
          
            return res.status(200).json({
                ok: true,
                licors
            })
            } catch (error) {
                return res.status(error.status || 500).json({
                    ok: false,
                    message: error.message || "Error al obtener las licors"
                })
            }
    
        }


module.exports = {
  getFavoriteDrink,
  getWhisky,
  getVinos,
  getLicors
}