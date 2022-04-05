import ProductDto from "@usecase/ProductDto"
import { v4 as uuidv4 } from 'uuid'
import CreateProductUseCase from "./CreateProductUseCase"
import ICreateProductGateway from "./ICreateProductGateway"
import ICreateProductRepository from "./ICreateProductRepository"

const createProductGatewayMock: jest.Mocked<ICreateProductGateway> = {
    create: jest.fn()
}

const createProductRepositoryMock: jest.Mocked<ICreateProductRepository> = {
    create: jest.fn()
}

const sutFactory = () => {
    const sut = new CreateProductUseCase(createProductGatewayMock, createProductRepositoryMock)

    return {
        sut
    }
}

describe('CreateProductUseCase', () => {

    it('should create a new product', async () => {
        expect.assertions(4)

        // given
        const { sut } = sutFactory()
        const expectedId = uuidv4()
        const newProduct: ProductDto = {
            name: "Item 1",
            price: 10.4,
            quantity: 7
        }

        // when
        createProductGatewayMock.create.mockResolvedValueOnce({ ...newProduct, id: expectedId })
        createProductRepositoryMock.create.mockResolvedValueOnce({ ...newProduct, id: expectedId })
        const createdProduct = await sut.execute(newProduct)

        // then
        expect(createdProduct).toBeDefined()
        expect(createdProduct).toStrictEqual({ ...newProduct, id: expectedId })
        expect(createProductGatewayMock.create).toHaveBeenCalledTimes(1)
        expect(createProductGatewayMock.create).toHaveBeenCalledWith(newProduct)
    })
})