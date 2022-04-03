import { Product } from "../../domain/product";

export default interface IGetAllProductsGateway {
    getAll(): Promise<Product[]>
    findOne(productId: string): Promise<Product>
}