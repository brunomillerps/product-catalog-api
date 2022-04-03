import { Product } from "src/application/domain/product";
import ProductDto from "./ProductDto";

export default interface ICreateProductGateway {
    create(product: ProductDto): Promise<Product>
}