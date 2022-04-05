import IGetAllProductsGateway from "@usecase/GetProducts/IGetProductsGateway";
import ProductDto from "@usecase/ProductDto";
import { SupplyChainBaseGateway } from "./SupplyChainBaseGateway";

export default class GetProductSupplyChainRest extends SupplyChainBaseGateway implements IGetAllProductsGateway {

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
            this.handleException(error)
        }
    }
}