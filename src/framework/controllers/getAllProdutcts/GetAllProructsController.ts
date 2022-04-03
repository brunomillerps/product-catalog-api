import GetAllProductsUseCase from "@usecase/GetProducts/GetAllProductsUseCase"
import { NextFunction, Request, Response } from "express"

export default class GetAllProductsController {

    constructor(private readonly allProductsUsecase: GetAllProductsUseCase) {}

    async findAllProducts(req: Request, res: Response, next: NextFunction) {

        try {
            const products = await this.allProductsUsecase.execute()

            res.status(200).send(products)
        } catch (error) {
            next(error)
        }
    }
}