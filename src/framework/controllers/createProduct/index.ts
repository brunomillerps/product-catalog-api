import CreateProductUseCase from "../../../../src/application/usecase/NewProduct/CreateProductUseCase";
import CreateProductSupplyChainRest from "../../../../src/gateway/CreateProductSupplyChainRes";
import CreateProductController from "./CreateProductController";

const createProductGateway = new CreateProductSupplyChainRest()
const createProductController = new CreateProductController(new CreateProductUseCase(createProductGateway))

export { createProductController, createProductGateway };
