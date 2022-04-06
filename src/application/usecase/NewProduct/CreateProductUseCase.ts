import ProductDto from "../ProductDto";
import ICreateProductGateway from "./ICreateProductGateway";
import ICreateProductRepository from "./ICreateProductRepository";

export default class CreateProductUseCase {

    constructor(
        private readonly createProductGateway: ICreateProductGateway,
        private readonly createProductRepository: ICreateProductRepository) {
    }

    async execute(product: ProductDto): Promise<ProductDto> {

        const externalProduct = await this.createProductGateway.create(product)
        const result = await this.createProductRepository.create({ ...externalProduct, supplyChainId: externalProduct.id })

        return <ProductDto>{
            id: result.id,
            name: result.name,
            price: result.price,
            quantity: result.quantity
        }
    }
}