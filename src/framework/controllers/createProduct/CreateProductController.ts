import { NextFunction, Request, Response } from "express"
import CreateProductUseCase from "src/application/usecase/NewProduct/CreateProductUseCase"

export default class CreateProductController {

    constructor(private readonly createProductUseCase: CreateProductUseCase) {}

    async handle(req: Request, res: Response, next: NextFunction) {

        try {
            const newProduct = req.body

            const product = await this.createProductUseCase.execute(newProduct)

            res.status(201).send(product)
        } catch (error) {
            next(error)
        }
    }
}