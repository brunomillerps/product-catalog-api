import ProductDto from "@usecase/ProductDto";

export default interface IGetAllProductsGateway {
    getAll(): Promise<ProductDto[]>
}