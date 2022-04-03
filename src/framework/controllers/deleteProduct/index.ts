import DeleteProductUseCase from "../../../../src/application/usecase/DeleteProduct/DeleteProductUseCase";
import DeleteProductSupplyChainRest from "../../../../src/gateway/DeleteProductSupplyChainRest";
import DeleteProductController from "./DeleteProductController";

const deleteProductGateway = new DeleteProductSupplyChainRest()
const deleteProductUsecase = new DeleteProductUseCase(deleteProductGateway)

const deleteProductController = new DeleteProductController(deleteProductUsecase)

export { deleteProductUsecase, deleteProductController };

