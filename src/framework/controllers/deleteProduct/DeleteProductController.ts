import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import DeleteProductUseCase from "src/application/usecase/DeleteProduct/DeleteProductUseCase"

export default class DeleteProductController {

    constructor(private readonly deleteProductUsecase: DeleteProductUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction) {

        try {
            const productId = req.params['productId']

            const deleted = await this.deleteProductUsecase.execute(productId)

            res.status(StatusCodes.NO_CONTENT).end()
        } catch (error) {
            next(error)
        }
    }
}