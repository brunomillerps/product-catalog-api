import ErrorException from "@domain/exceptions/ErrorException";
import { ProductNotFoundException } from "@domain/exceptions/ProductNotFound";
import IDeleteProductGateway from "@usecase/DeleteProduct/IDeleteProductGateway";
import { BrokenCircuitError } from "cockatiel";
import { StatusCodes } from "http-status-codes";
import SupplyChainClientRest from "./SupplyChainClientRest";

export default class DeleteProductSupplyChainRest implements IDeleteProductGateway {

    constructor(private readonly client?: SupplyChainClientRest) {
        this.client = client || new SupplyChainClientRest()
    }

    async delete(productId: string): Promise<boolean> {
        try {
            const productsResponse = await this.client.deleteProduct(productId)

            return true

        } catch (error) {

            if (error instanceof BrokenCircuitError) {
                throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.SERVICE_UNAVAILABLE)
            }

            // axios doesn't throw a typed Error
            if (error['response']) {
                switch (error['response']['status']) {
                    case 400:
                        throw new ErrorException(error['message'], StatusCodes.BAD_REQUEST)
                    case 404:
                        throw new ProductNotFoundException(productId)
                    default:
                        throw new ErrorException("Supply chain service is unreachable. Try again later", StatusCodes.SERVICE_UNAVAILABLE)
                }
            }
            throw error
        }
    }
}