import GetAllProductsUseCase from "@usecase/GetProducts/GetAllProductsUseCase"
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"

export default class GetAllProductsController {

    constructor(private readonly allProductsUsecase: GetAllProductsUseCase) { }

    async handle(req: Request, res: Response, next: NextFunction) {

        try {
            const products = await this.allProductsUsecase.execute()

            res.status(StatusCodes.OK).send(products)
        } catch (error) {
            next(error)
        }
    }
}