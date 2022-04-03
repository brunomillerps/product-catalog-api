import CreateProductSupplyChainRest from "@gateway/CreateProductSupplyChainRest";
import CreateProductUseCase from "@usecase/NewProduct/CreateProductUseCase";
import CreateProductController from "./CreateProductController";

const createProductGateway = new CreateProductSupplyChainRest()
const createProductController = new CreateProductController(new CreateProductUseCase(createProductGateway))

export { createProductController, createProductGateway };
