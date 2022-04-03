import { Product } from "src/application/domain/product";
import IGetAllProductsGateway from "./IGetProductsGateway";

export default class GetAllProductsUseCase {
    constructor(private readonly getProductGateway: IGetAllProductsGateway) {}

    async execute(): Promise<Product[]> {
        return await this.getProductGateway.getAll()
    }
}