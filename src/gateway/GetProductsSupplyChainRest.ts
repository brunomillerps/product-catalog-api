import ErrorException from "@domain/exceptions/ErrorException";
import { Product } from "@domain/product";
import IGetAllProductsGateway from "@usecase/GetProducts/IGetProductsGateway";
import { StatusCodes } from "http-status-codes";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class GetProductSupplyChainRest implements IGetAllProductsGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || SupplyChainClientRest.getInstance()
    }

    async getAll(): Promise<Product[]> {
        try {
            const productsResponse = await this.client.getAllProducts()
            return productsResponse['data']['bundle'].map((i: Omit<Product, "id">) => new Product(i))

        } catch (error) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.GATEWAY_TIMEOUT, error)
        }
    }

    findOne(productId: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
}