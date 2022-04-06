import GetProductMongoDbRepository from "@gateway/db/GetProductRepository"
import GetProductSupplyChainRest from "@gateway/supplyChain/rest/GetProductsSupplyChainRest"
import GetAllProductsUseCase from "@usecase/GetProducts/GetAllProductsUseCase"
import GetAllProductsController from "./GetAllProructsController"

const getProductsGateway = new GetProductSupplyChainRest()
const getProductRepository = new GetProductMongoDbRepository()
const getAllProductsUseCase = new GetAllProductsUseCase(getProductsGateway, getProductRepository)


const getAllProductsController = new GetAllProductsController(getAllProductsUseCase)

export { getAllProductsUseCase, getAllProductsController }

