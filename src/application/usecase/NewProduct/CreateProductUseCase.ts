import { Product } from "../../domain/product";
import ICreateProductGateway from "./INewProductGateway";
import ProductDto from "./ProductDto";

export default class CreateProductUseCase {

    constructor(private readonly createProductGateway: ICreateProductGateway){
    }

    async execute(product: ProductDto): Promise<Product> {
        return this.createProductGateway.create(product)
    }
}