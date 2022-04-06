import ProductDto from "@usecase/ProductDto";
import IGetProductsRepository from "./IGetProductRepository";
import IGetAllProductsGateway from "./IGetProductsGateway";

export default class GetAllProductsUseCase {
    constructor(
        private readonly getProductGateway: IGetAllProductsGateway,
        private readonly getProductRepository: IGetProductsRepository
    ) { }

    async execute(): Promise<ProductDto[]> {
        const dbAllPromise = this.getProductRepository.getAll()

        const serviceAllPromise = this.getProductGateway.getAll()

        return Promise.all([dbAllPromise, serviceAllPromise]).then(([a, b]) => {

            let result: ProductDto[] = []
            // decide which response is from db or service
            if (a[0] && a[0]['supplyChainId']) {
                // update the from supply chain server for the ID from our db
                b.forEach((el) => {
                    const found = a.find(p => p.supplyChainId === el.id)
                    el.id = found?.id || el.id
                })
                result = b
            } else {
                // update the from supply chain server for the ID from our db
                a.forEach((el) => {
                    const found = b.find(p => p.supplyChainId === el.id)
                    el.id = found?.id || el.id
                })
                result = a
            }

            return result
        })
    }
}