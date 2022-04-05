import ErrorException from "@domain/exceptions/ErrorException";
import { ProductNotFoundException } from "@domain/exceptions/ProductNotFound";
import { AxiosResponse } from "axios";
import { BrokenCircuitError } from "cockatiel";
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

    [
        { message: 'Any business error', expectedInstanceOf: ErrorException, error: { response: { status: 400 } } },
        { message: 'Not Found', expectedInstanceOf: ProductNotFoundException, error: { response: { status: 404 } } },
        { message: 'Server is unavailable', expectedInstanceOf: ErrorException, error: { response: { status: 500 } } },
        { message: 'Circuit is open', expectedInstanceOf: ErrorException, error: new BrokenCircuitError() },
        { message: 'General exception', expectedInstanceOf: Error, error: new Error("Error 503") },
    ].forEach((err) => {
        it(`should throw expcetion "${err.message}" when calling supply chain client DELETE`, async () => {
            // given
            const { sut, supplyChainClientRestMock } = sutFactory()

            // when
            supplyChainClientRestMock.deleteProduct.mockRejectedValue(err.error)

            let errorExpect: Error
            try {
                await sut.delete("111")
            } catch (error) {
                errorExpect = error
            }

            // then
            expect(supplyChainClientRestMock.deleteProduct).toHaveBeenCalledTimes(1)
            expect(errorExpect).toBeInstanceOf(err.expectedInstanceOf)
        });
    })
});