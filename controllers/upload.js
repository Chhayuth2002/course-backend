const Image = require("../models/Image")


const uploadFile =async (req, res) => {
  const basePath  = `${req.protocol}://${req.get("host")}/public/uploads/`
  try { 
    const fileName = req.file.filename
    
    const image = await Image.query().insert({
      url: `${basePath}${fileName}`, 
      entity: req.body.entity
    })
  
    res.json(image)
    
  } catch (error) {
    res.json({error: error.message})
  }
}

module.exports = uploadFile