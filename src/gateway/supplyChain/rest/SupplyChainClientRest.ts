import ProductDto from "@usecase/ProductDto";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { ConsecutiveBreaker, IDefaultPolicyContext, IPolicy, Policy } from 'cockatiel';

export default class SupplyChainClientRest {

    retryWithBreaker: IPolicy<IDefaultPolicyContext, never>

    static retryPolicy: IPolicy<IDefaultPolicyContext, any> =
        Policy
            .handleType(Error, e => e.message.startsWith('Request failed with status code 5'))
            .retry().attempts(3).exponential()

    static circuitBreakerPolicy: IPolicy<IDefaultPolicyContext, any> =
        Policy
            .handleType(Error, e => e.message.startsWith('Request failed with status code 5'))
            // 5 seconds to recovery
            .circuitBreaker(5 * 1000, new ConsecutiveBreaker(4))

    constructor(private readonly instance?: AxiosInstance, circuitBrakerPolicy?: IPolicy<IDefaultPolicyContext, never>) {

        this.instance = instance || axios.create({ baseURL: process.env.SUPPLY_CHAIN_HOST })

        this.retryWithBreaker = circuitBrakerPolicy || Policy.wrap(SupplyChainClientRest.retryPolicy, SupplyChainClientRest.circuitBreakerPolicy);

        this.retryWithBreaker.onFailure(({ duration, handled, reason }) => {
            console.log(`circuit breaker call ran in ${duration}ms and failed with`, reason);
            console.log(handled ? 'error was handled' : 'error was not handled');
        })
    }

    getAllProducts(): Promise<AxiosResponse> {
        return this.retryWithBreaker.execute(() => this.instance.get(process.env.SUPPLY_CHAIN_BASE_PATH))
    }

    createProduct(product: ProductDto): Promise<AxiosResponse> {
        return this.retryWithBreaker.execute(() => this.instance.post(process.env.SUPPLY_CHAIN_BASE_PATH, product))
    }

    deleteProduct(productId: string): Promise<AxiosResponse> {
        return this.retryWithBreaker.execute(() => this.instance.delete(`${process.env.SUPPLY_CHAIN_BASE_PATH}/${productId}`))
    }
}