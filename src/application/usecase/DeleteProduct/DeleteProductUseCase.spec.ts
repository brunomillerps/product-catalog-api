import { InvalidProductIdException } from "@domain/exceptions/InvalidProductIdException"
import { v4 as uuidv4 } from 'uuid'
import DeleteProductUseCase from "./DeleteProductUseCase"
import IDeleteProductGateway from "./IDeleteProductGateway"


const deleteProductGatewayMock: jest.Mocked<IDeleteProductGateway> = {
    delete: jest.fn()
}

const sutFactory = () => {
    const sut = new DeleteProductUseCase(deleteProductGatewayMock)

    return {
        sut
    }
}

describe('Delete Product use case', () => {

    it('should delete a product given a valid product id', async () => {
        expect.assertions(3)

        // given
        const productId = uuidv4()
        const { sut } = sutFactory()

        // when
        deleteProductGatewayMock.delete.mockResolvedValueOnce(true)
        const deleted = await sut.execute(productId)

        // then
        expect(deleted).toBeTruthy()
        expect(deleteProductGatewayMock.delete).toHaveBeenCalledTimes(1)
        expect(deleteProductGatewayMock.delete).toHaveBeenCalledWith(productId)
    })

    it('should thown error for a invalid product id', async () => {
        expect.assertions(1)

        // given
        const { sut } = sutFactory()

        try {
            await sut.execute('invalid product id')
        } catch (error) {
            expect(error).toBeInstanceOf(InvalidProductIdException)
        }
    })
})