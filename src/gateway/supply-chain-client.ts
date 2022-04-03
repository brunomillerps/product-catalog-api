import { Product } from "src/application/domain/product";
import { Http } from "./http/axios-instance";

export default class SupplyChainClientRest extends Http {

    constructor() {
        const host: string = process.env.SUPPLY_CHAIN_HOST || 'https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com/test/supply-chain'

        super(host)
    }

    async getAllProducts() : Promise<Array<Product>> {
        return this.instance.get("/")
    }
}