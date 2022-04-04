import ErrorException from "@domain/exceptions/ErrorException";
import ICreateProductGateway from "@usecase/NewProduct/INewProductGateway";
import ProductDto from "@usecase/ProductDto";
import { StatusCodes } from "http-status-codes";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class CreateProductSupplyChainRest implements ICreateProductGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || SupplyChainClientRest.getInstance()
    }

    async create(product: ProductDto): Promise<ProductDto> {
        try {
            const productsResponse = await this.client.createProduct(product)

            return { ...productsResponse.data }

        } catch (error) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.GATEWAY_TIMEOUT, error)
        }
    }
}