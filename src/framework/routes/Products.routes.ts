import express from 'express'
import GetAllProductsController from '../controllers/GetAllProructsController'

export default class ProductRoutes {

    routes(): express.Router {

        return express.Router()
            .get('/', new GetAllProductsController().findAllProducts)

    }
}