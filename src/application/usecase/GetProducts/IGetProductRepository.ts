import ProductDto from "@usecase/ProductDto";

export default interface IGetProductsRepository {
    getAll(): Promise<ProductDto[]>
}