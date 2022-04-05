import GetProductSupplyChainRest from "@gateway/supplyChain/rest/GetProductsSupplyChainRest"
import GetAllProductsUseCase from "@usecase/GetProducts/GetAllProductsUseCase"
import GetAllProductsController from "./GetAllProructsController"

const getProductsGateway = new GetProductSupplyChainRest()
const getAllProductsUseCase = new GetAllProductsUseCase(getProductsGateway)


const getAllProductsController = new GetAllProductsController(getAllProductsUseCase)

export { getAllProductsUseCase, getAllProductsController }

