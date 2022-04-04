import ErrorException from "@domain/exceptions/ErrorException";
import { AxiosResponse } from "axios";
import DeleteProductSupplyChainRest from "./DeleteProductSupplyChainRest";
import SupplyChainClientRest from "./SupplyChainClientRest";

jest.mock('./SupplyChainClientRest')

const SupplyChainClientRestMock = SupplyChainClientRest as jest.Mocked<typeof SupplyChainClientRest>

const sutFactory = () => {
    const supplyChainClientRestMock = new SupplyChainClientRestMock() as jest.Mocked<SupplyChainClientRest>
    const sut = new DeleteProductSupplyChainRest(supplyChainClientRestMock)

    return {
        sut,
        supplyChainClientRestMock,
    }
}

describe('DeleteProductSupplyChainRest', () => {
    it('should call supply chain client to delete a product', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()

        const axiosResponse: AxiosResponse = {
            data: {},
            status: 204, statusText: "No Content", headers: {}, config: {}
        }

        // when
        supplyChainClientRestMock.deleteProduct.mockResolvedValue(axiosResponse)
        const deleted = await sut.delete("123")

        expect(deleted).toBeTruthy()
        expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(1)
        expect(supplyChainClientRestMock.createProduct).toHaveBeenCalledTimes(0)
        expect(supplyChainClientRestMock.getAllProducts).toHaveBeenCalledTimes(0)
    });

    it('should throw expcetion when calling supply chain client DELETE', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()

        // when
        supplyChainClientRestMock.deleteProduct.mockRejectedValue(new Error("unavailable server"))

        let errorExpect: Error
        try {
            await sut.delete("111")
        } catch (error) {
            errorExpect = error
        }

        expect(errorExpect).toBeInstanceOf(ErrorException)
        expect(errorExpect.name).toBe("ErrorException")
        expect(errorExpect.message).toBe("Supply chain service is unreachable. Try again later")
        expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(1)
    });
});