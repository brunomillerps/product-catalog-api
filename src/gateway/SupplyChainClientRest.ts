import ProductDto from "@usecase/ProductDto";
import { AxiosResponse } from "axios";
import { ConsecutiveBreaker, IDefaultPolicyContext, IPolicy, IRetryContext, Policy } from 'cockatiel';
import { Http } from "./http/axios-instance";

export default class SupplyChainClientRest extends Http {

    private static retryWithBreaker: IPolicy<IDefaultPolicyContext, never>

    static retryPolicy: IPolicy<IDefaultPolicyContext, any> = Policy.handleAll().retry().attempts(3).exponential()
    static circuitBreakerPolicy: IPolicy<IDefaultPolicyContext, any> = Policy.handleAll().circuitBreaker(10 * 1000, new ConsecutiveBreaker(3))

    constructor(circuitBrakerPolicy?: IPolicy<IRetryContext, never>) {
        const host: string = process.env.SUPPLY_CHAIN_HOST || 'https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test/supply-chain'
        super(host)

        SupplyChainClientRest.retryWithBreaker = circuitBrakerPolicy || Policy.wrap(SupplyChainClientRest.retryPolicy, SupplyChainClientRest.circuitBreakerPolicy);

        SupplyChainClientRest.retryWithBreaker.onFailure(({ duration, handled, reason }) => {
            console.log(`circuit breaker call ran in ${duration}ms and failed with`, reason);
            console.log(handled ? 'error was handled' : 'error was not handled');
        });
    }

    getAllProducts(): Promise<AxiosResponse> {
        return SupplyChainClientRest.retryWithBreaker.execute(() => this.instance.get("/"))
    }

    createProduct(product: ProductDto): Promise<AxiosResponse> {
        return SupplyChainClientRest.retryWithBreaker.execute(() => this.instance.post("/", product))
    }

    deleteProduct(productId: string): Promise<AxiosResponse> {
        return SupplyChainClientRest.retryWithBreaker.execute(() => this.instance.delete(`/${productId}`))
    }
}