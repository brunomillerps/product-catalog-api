import ProductDto from "../ProductDto";
import ICreateProductGateway from "./INewProductGateway";

export default class CreateProductUseCase {

    constructor(private readonly createProductGateway: ICreateProductGateway) {
    }

    async execute(product: ProductDto): Promise<ProductDto> {
        return this.createProductGateway.create(product)
    }
}