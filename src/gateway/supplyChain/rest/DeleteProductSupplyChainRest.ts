import IDeleteProductGateway from "@usecase/DeleteProduct/IDeleteProductGateway";
import { SupplyChainBaseGateway } from "./SupplyChainBaseGateway";

export default class DeleteProductSupplyChainRest extends SupplyChainBaseGateway implements IDeleteProductGateway {

    async delete(productId: string): Promise<boolean> {
        try {
            await this.client.deleteProduct(productId)
            return true

        } catch (error) {
            this.handleException(error, productId)
        }
    }
}