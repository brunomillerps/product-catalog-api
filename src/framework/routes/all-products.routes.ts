import CommonRoutesConfig from "./common.routes"
import express from "express"
import SupplyChainClientRest from "../../../src/gateway/supply-chain-client"

export default class ListAllProductRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, "ProductsRoutes")
    }

    public configureRoutes(): express.Application {
        this.app.route('/api/v1/products')
            .get(async (_, res: express.Response) => {
                const products = await new SupplyChainClientRest().getAllProducts()
                res.status(200).send(products['data'])
            })

        return this.app
    }
}