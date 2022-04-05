import ICreateProductGateway from "@usecase/NewProduct/ICreateProductGateway";
import ProductDto from "@usecase/ProductDto";
import { SupplyChainBaseGateway } from "./SupplyChainBaseGateway";

export default class CreateProductSupplyChainRest extends SupplyChainBaseGateway implements ICreateProductGateway {

    async create(product: ProductDto): Promise<ProductDto> {
        try {
            const productsResponse = await this.client.createProduct(product)

            return { ...productsResponse.data }

        } catch (error) {
            this.handleException(error)
        }
    }
}