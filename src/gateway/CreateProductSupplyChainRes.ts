import { StatusCodes } from "http-status-codes";
import ErrorException from "../../src/application/domain/exceptions/ErrorException";
import { Product } from "../../src/application/domain/product";
import ICreateProductGateway from "../../src/application/usecase/NewProduct/INewProductGateway";
import ProductDto from "../../src/application/usecase/NewProduct/ProductDto";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class CreateProductSupplyChainRest implements ICreateProductGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || SupplyChainClientRest.getInstance()
    }

    async create(product: ProductDto): Promise<Product> {
        try {
            const productsResponse = await this.client.createProduct(product)
            
            return new Product(productsResponse.data)
            
        } catch (error) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.GATEWAY_TIMEOUT, error)
        }
    }
}