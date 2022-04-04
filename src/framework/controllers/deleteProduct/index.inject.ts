import DeleteProductSupplyChainRest from "@gateway/DeleteProductSupplyChainRest";
import DeleteProductUseCase from "@usecase/DeleteProduct/DeleteProductUseCase";
import DeleteProductController from "./DeleteProductController";

const deleteProductGateway = new DeleteProductSupplyChainRest()
const deleteProductUsecase = new DeleteProductUseCase(deleteProductGateway)

const deleteProductController = new DeleteProductController(deleteProductUsecase)

export { deleteProductUsecase, deleteProductController };

