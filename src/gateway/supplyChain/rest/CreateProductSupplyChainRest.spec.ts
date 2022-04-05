import ErrorException from "@domain/exceptions/ErrorException";
import ProductDto from "@usecase/ProductDto";
import { AxiosResponse } from "axios";
import CreateProductSupplyChainRest from "./CreateProductSupplyChainRest";
import SupplyChainClientRest from "./SupplyChainClientRest";

jest.mock('./SupplyChainClientRest')

const SupplyChainClientRestMock = SupplyChainClientRest as jest.Mocked<typeof SupplyChainClientRest>

const sutFactory = () => {
    const supplyChainClientRestMock = new SupplyChainClientRestMock() as jest.Mocked<SupplyChainClientRest>
    const sut = new CreateProductSupplyChainRest(supplyChainClientRestMock)

    return {
        sut,
        supplyChainClientRestMock,
    }
}

describe('CreateProductSupplyChainRest', () => {
    it('should call supply chain client to create a product', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()
        const product: ProductDto = { name: "Product 1", price: 29, quantity: 10 }

        const axiosResponse: AxiosResponse = {
            data: product,
            status: 201, statusText: "Created", headers: {}, config: {}
        }

        // when
        supplyChainClientRestMock.createProduct.mockResolvedValue(axiosResponse)
        const expectedProduct = await sut.create(product)

        expect(expectedProduct).toEqual(product)
        expect(supplyChainClientRestMock.createProduct).toHaveBeenCalledTimes(1)
        expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(0)
        expect(supplyChainClientRestMock.getAllProducts).toHaveBeenCalledTimes(0)
    });

    it('should throw generic expcetion when calling supply chain client', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()
        const product: ProductDto = { name: "Product 1", price: 29, quantity: 10 }

        // when
        supplyChainClientRestMock.createProduct.mockRejectedValue({
            response: { status: 503 },
            message: "partner server is unavailable"
        })

        let errorExpect: Error
        try {
            await sut.create(product)
        } catch (error) {
            errorExpect = error
        }

        expect(errorExpect).toBeInstanceOf(ErrorException)
        expect(errorExpect.message).toBe("Supply chain service is unreachable. Try again later")

        expect(supplyChainClientRestMock.createProduct).toHaveBeenCalledTimes(1)
        expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(0)
        expect(supplyChainClientRestMock.getAllProducts).toHaveBeenCalledTimes(0)
    });
});