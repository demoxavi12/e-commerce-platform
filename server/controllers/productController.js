import productModel from '../models/productModel.js'
import cloudinary from '../config/cloudinary.js'

// add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, sizes, bestseller,limitedStocks } = req.body

        // 1. Extract the paths (Strings)
        const image1 = req.files.image1 && req.files.image1[0].path
        const image2 = req.files.image2 && req.files.image2[0].path
        const image3 = req.files.image3 && req.files.image3[0].path
        const image4 = req.files.image4 && req.files.image4[0].path

        // 2. Create array of valid paths
        const images = [image1, image2, image3, image4].filter(item => item !== undefined)

        // 3. Upload to Cloudinary
        const imagesUrl = await Promise.all(
            images.map(async (item) => {

                const result = await cloudinary.uploader.upload(item, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productdata = {
            name,
            description,
            price: Number(price),
            category,
            subcategory,
            sizes: sizes ? JSON.parse(sizes) : [],
            bestseller: bestseller === 'true' ? true : false,
            limitedStocks: limitedStocks === 'true' ? true : false,
            images: imagesUrl,
            date: Date.now()
        }
        console.log(productdata)




        const product = new productModel(productdata)
        await product.save()

        

        res.json({ success: true, message: "Product added successfully" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//list products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//removing products
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product removed successfully" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
        
    }
}

//single product info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body    
        const product = await productModel.findById(productId)
        res.json({ success: true, product })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct
}