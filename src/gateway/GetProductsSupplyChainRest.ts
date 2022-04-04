import ErrorException from "@domain/exceptions/ErrorException";
import IGetAllProductsGateway from "@usecase/GetProducts/IGetProductsGateway";
import ProductDto from "@usecase/ProductDto";
import { StatusCodes } from "http-status-codes";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class GetProductSupplyChainRest implements IGetAllProductsGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || new SupplyChainClientRest()
    }

    async getAll(): Promise<ProductDto[]> {
        try {
            const productsResponse = await this.client.getAllProducts()

            if (productsResponse['data']) {
                return productsResponse['data']['bundle'].map(p => {
                    return <ProductDto>{
                        id: p['id'],
                        name: p['name'],
                        price: p['price'],
                        quantity: p['quantity']
                    }
                })
            }

            return []

        } catch (error) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.INTERNAL_SERVER_ERROR, error)
        }
    }
}