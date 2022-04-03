import { NextFunction, Request, Response } from "express"
import GetAllProductsUseCase from "../../../src/application/usecase/GetProducts/GetAllProductsUseCase"
import GetProductSupplyChainRest from "../../../src/gateway/GetProductsSupplyChainRest"

export default class GetAllProductsController {
    
    async findAllProducts (req: Request, res: Response, next: NextFunction) {

        try {
            const getProducts = new GetAllProductsUseCase(new GetProductSupplyChainRest())
    
            const products = await getProducts.execute()
        
            res.status(200).send(products)
            
        } catch (error) {
            next(error)
        }
    }
}