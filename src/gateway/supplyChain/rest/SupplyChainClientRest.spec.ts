import ProductDto from '@usecase/ProductDto';
import axios from 'axios';
import { ConsecutiveBreaker, IDefaultPolicyContext, IPolicy, Policy } from 'cockatiel';
import SupplyChainClientRest from "./SupplyChainClientRest";


jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>;

const retryWithBreaker: IPolicy<IDefaultPolicyContext, never> = Policy.wrap(SupplyChainClientRest.retryPolicy, SupplyChainClientRest.circuitBreakerPolicy)

describe('SupplyChainClientRest', () => {

    it('should call axios GET', async () => {
        // given
        expect.assertions(1)
        const sut = new SupplyChainClientRest(mockedAxios, retryWithBreaker)
        // when
        mockedAxios.get.mockResolvedValue([{}])
        await sut.getAllProducts()

        // then
        expect(mockedAxios.get).toBeCalledTimes(1)
    });

    it('should call axios DELETE', async () => {
        // given
        expect.assertions(2)
        const sut = new SupplyChainClientRest(mockedAxios, retryWithBreaker)
        // when
        mockedAxios.delete.mockResolvedValue({})

        const productId = "2"
        await sut.deleteProduct(productId)

        // then
        expect(mockedAxios.delete).toBeCalledTimes(1)
        expect(mockedAxios.delete).toBeCalledWith(`/test/supply-chain/${productId}`)
    });

    it('should call axios POST', async () => {
        // given
        expect.assertions(2)
        const sut = new SupplyChainClientRest(mockedAxios, retryWithBreaker)
        // when
        await sut.createProduct({} as ProductDto)
        mockedAxios.post.mockResolvedValue({})

        // then
        expect(mockedAxios.post).toBeCalledTimes(1)
        expect(mockedAxios.post).toBeCalledWith('/test/supply-chain', {} as ProductDto)
    });

    it('should retry request 3 times with default implementation', async () => {
        // given
        expect.assertions(2)
        const sut = new SupplyChainClientRest(mockedAxios, retryWithBreaker)

        const executeBreakerSpy = jest.spyOn(retryWithBreaker, 'execute')

        // when
        mockedAxios.post.mockRejectedValue(new Error("Request failed with status code 5"))

        let error: Error
        try {
            await sut.createProduct({} as ProductDto)
        } catch (err) {
            error = err
        }

        // then
        expect(mockedAxios.post).toHaveBeenCalledTimes(4)
        expect(executeBreakerSpy).toHaveBeenCalledTimes(1)
    });

    it('should open circuit when POST request fails', async () => {
        // expect.assertions(2)
        // given
        const circuitBreakerPolicy: IPolicy<IDefaultPolicyContext, any> =
            Policy
                .handleType(Error, e => e.message.startsWith('Request failed with status code 5'))
                // 2 seconds to recovery
                .circuitBreaker(2 * 1000, new ConsecutiveBreaker(1))

        const sut = new SupplyChainClientRest(mockedAxios, Policy.wrap(SupplyChainClientRest.retryPolicy, circuitBreakerPolicy))

        // when
        mockedAxios.post.mockRejectedValueOnce(new Error("Request failed with status code 5"))
        mockedAxios.post.mockResolvedValueOnce({})

        let error: Error
        try {
            await sut.createProduct({} as ProductDto)
        } catch (err) {
            error = err
        }

        // then
        expect(error.message).toBe("Execution prevented because the circuit breaker is open")
        expect(mockedAxios.post).toHaveBeenCalledTimes(1)

        await sleep(2000)
            .then(() => sut.createProduct({} as ProductDto))
            .then(() => expect(mockedAxios.post).toHaveBeenCalledTimes(2))
    });
});

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}