import { Router } from 'express'
import { getAllProductsController } from '../controllers/getAllProdutcts'

const producRouter = Router()

producRouter.get('/', (req, res, next) => {
    return getAllProductsController.findAllProducts(req, res, next)
})

export { producRouter }

