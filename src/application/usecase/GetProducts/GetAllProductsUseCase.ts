import ProductDto from "@usecase/ProductDto";
import IGetAllProductsGateway from "./IGetProductsGateway";

export default class GetAllProductsUseCase {
    constructor(private readonly getProductGateway: IGetAllProductsGateway) {}

    async execute(): Promise<ProductDto[]> {
        return await this.getProductGateway.getAll()
    }
}