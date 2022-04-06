import ProductDto from "@usecase/ProductDto";
import { v4 as uuidv4 } from 'uuid';
import GetAllProductsUseCase from "./GetAllProductsUseCase";
import IGetProductsRepository from "./IGetProductRepository";
import IGetAllProductsGateway from "./IGetProductsGateway";

const getAllProductsGatewayMock: jest.Mocked<IGetAllProductsGateway> = {
    getAll: jest.fn()
}

const getProductsRepositoryMock: jest.Mocked<IGetProductsRepository> = {
    getAll: jest.fn(),
    get: jest.fn()
}

const sutFactory = () => {
    const sut = new GetAllProductsUseCase(getAllProductsGatewayMock, getProductsRepositoryMock)

    return {
        sut
    }
}

describe('GetAllProductsUseCase', () => {

    it('should get a list of products', async () => {
        expect.assertions(3)

        // given
        const { sut } = sutFactory()
        const products: ProductDto[] = [
            { name: "Product A", price: 99.9, quantity: 10, id: uuidv4() },
            { name: "Product B", price: 8.1, quantity: 1, id: uuidv4() }
        ]

        // when
        getAllProductsGatewayMock.getAll.mockResolvedValueOnce(products)
        getProductsRepositoryMock.getAll.mockResolvedValueOnce([])
        const productList = await sut.execute()

        // then
        expect(productList).toBeDefined()
        expect(productList).toBe(products)
        expect(getAllProductsGatewayMock.getAll).toHaveBeenCalledTimes(1)
    })
})