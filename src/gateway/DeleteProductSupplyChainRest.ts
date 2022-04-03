import ErrorException from "@domain/exceptions/ErrorException";
import IDeleteProductGateway from "@usecase/DeleteProduct/IDeleteProductGateway";
import { StatusCodes } from "http-status-codes";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class DeleteProductSupplyChainRest implements IDeleteProductGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || SupplyChainClientRest.getInstance()
    }

    async delete(productId: string): Promise<boolean> {
        try {
            const productsResponse = await this.client.deleteProduct(productId)
            
            return true
            
        } catch (error) {
            throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.GATEWAY_TIMEOUT, error)
        }
    }
}