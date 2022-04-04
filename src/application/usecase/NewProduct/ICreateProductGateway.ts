import ProductDto from "../ProductDto";

export default interface ICreateProductGateway {
    create(product: ProductDto): Promise<ProductDto>
}