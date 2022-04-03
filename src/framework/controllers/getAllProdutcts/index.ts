import GetAllProductsUseCase from "../../../../src/application/usecase/GetProducts/GetAllProductsUseCase"
import GetProductSupplyChainRest from "../../../../src/gateway/GetProductsSupplyChainRest"
import GetAllProductsController from "./GetAllProructsController"

const getProductsGateway = new GetProductSupplyChainRest()
const getAllProductsUseCase = new GetAllProductsUseCase(getProductsGateway)


const getAllProductsController = new GetAllProductsController(getAllProductsUseCase)

export { getAllProductsUseCase, getAllProductsController }

