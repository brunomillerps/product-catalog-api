import CreateProductMongoDbRepository from "@gateway/db/CreateProductRepository";
import CreateProductSupplyChainRest from "@gateway/supplyChain/rest/CreateProductSupplyChainRest";
import CreateProductUseCase from "@usecase/NewProduct/CreateProductUseCase";
import CreateProductController from "./CreateProductController";

const createProductGateway = new CreateProductSupplyChainRest()
const createProductMongoDbRepository = new CreateProductMongoDbRepository()
const createProductController = new CreateProductController(new CreateProductUseCase(createProductGateway, createProductMongoDbRepository))

export { createProductController, createProductGateway };
