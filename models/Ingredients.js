const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
    drink: {
        type: String,
        required : true,
        trim: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
     
      
    }
},
{
    timestamps : true
}

)



module.exports = mongoose.model('Ingredients', ingredientsSchema)