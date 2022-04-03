import CreateProductUseCase from "@usecase/NewProduct/CreateProductUseCase"
import { NextFunction, Request, Response } from "express"

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