import { AxiosResponse } from "axios";
import { ConsecutiveBreaker, IPolicy, IRetryContext, Policy } from 'cockatiel';
import { Http } from "./http/axios-instance";


export default class SupplyChainClientRest extends Http {

    private static _instance: SupplyChainClientRest
    static SupplyChainClientRest: SupplyChainClientRest
    private retryWithBreaker: IPolicy<IRetryContext, never>

    private constructor() {
        const host: string = process.env.SUPPLY_CHAIN_HOST || 'https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test/supply-chain'
        super(host)

        const retry = Policy.handleAll().retry().attempts(3).exponential();
        const circuitBreaker = Policy.handleAll().circuitBreaker(10 * 1000, new ConsecutiveBreaker(1));

        this.retryWithBreaker = Policy.wrap(retry, circuitBreaker);

    }

    public static getInstance(): SupplyChainClientRest {

        return this._instance || (this._instance = new this())
    }

    getAllProducts(): Promise<AxiosResponse> {

        return this.retryWithBreaker.execute(() => this.instance.get("/"))
    }
}