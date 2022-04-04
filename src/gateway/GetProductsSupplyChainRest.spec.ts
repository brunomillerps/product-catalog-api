import ErrorException from "@domain/exceptions/ErrorException";
import ProductDto from "@usecase/ProductDto";
import { AxiosResponse } from "axios";
import { v4 as uuidv4 } from 'uuid';
import GetProductSupplyChainRest from "./GetProductsSupplyChainRest";
import SupplyChainClientRest from "./SupplyChainClientRest";

jest.mock('./SupplyChainClientRest')

const SupplyChainClientRestMock = SupplyChainClientRest as jest.Mocked<typeof SupplyChainClientRest>

const sutFactory = () => {
    const supplyChainClientRestMock = new SupplyChainClientRestMock() as jest.Mocked<SupplyChainClientRest>
    const sut = new GetProductSupplyChainRest(supplyChainClientRestMock)

    return {
        sut,
        supplyChainClientRestMock,
    }
}

describe('GetProductSupplyChainRest', () => {
    it('should call supply chain client to and get list of products', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()

        const axiosData: ProductDto[] = [
            { name: "product 1", price: 1, quantity: 2, id: uuidv4() },
            { name: "product 2", price: 2, quantity: 4, id: uuidv4() }
        ]
        const axiosResponse: AxiosResponse = {
            data: { bundle: axiosData },
            status: 200, statusText: "OK", headers: {}, config: {}
        }

        // when
        supplyChainClientRestMock.getAllProducts.mockResolvedValue(axiosResponse)
        const productList = await sut.getAll()

        expect(productList).toEqual(axiosData)
        expect(supplyChainClientRestMock.getAllProducts).toHaveBeenCalledTimes(1)
        expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(0)
        expect(supplyChainClientRestMock.createProduct).toHaveBeenCalledTimes(0)
    });

    it('should throw expcetion when calling supply chain client GET', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()

        // when
        supplyChainClientRestMock.getAllProducts.mockRejectedValue(new Error("unavailable server"))

        let errorExpect: Error
        try {
            await sut.getAll()
        } catch (error) {
            errorExpect = error
        }

        expect(errorExpect).toBeInstanceOf(ErrorException)
        expect(errorExpect.name).toBe("ErrorException")
        expect(errorExpect.message).toBe("Supply chain service is unreachable. Try again later")
        expect(supplyChainClientRestMock.getAllProducts).toHaveBeenCalledTimes(1)
    });
});