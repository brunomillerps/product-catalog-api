import ProductDto from "../ProductDto";

export default interface ICreateProductRepository {
    create(product: ProductDto): Promise<ProductDto>
}