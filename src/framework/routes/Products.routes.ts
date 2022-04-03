import { Router } from 'express'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'
import { createProductController } from '../controllers/createProduct'
import { deleteProductController } from '../controllers/deleteProduct'
import { getAllProductsController } from '../controllers/getAllProdutcts'

const validator = createValidator()
  
const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().integer().required()
})

const producRouter = Router()

producRouter.get('/', (req, res, next) => {
    return getAllProductsController.findAllProducts(req, res, next)
})

producRouter.post('/', validator.body(productSchema), (req, res, next) => {
    return createProductController.handle(req, res, next)
})

producRouter.delete('/:productId', (req, res, next) => {
    return deleteProductController.handle(req, res, next)
})

export { producRouter }

