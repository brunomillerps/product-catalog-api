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
    it('should call http client and returns a list of products', async () => {

        // given
        const { sut, supplyChainClientRestMock } = sutFactory()
        const product: ProductDto = { name: "Product 1", price: 29, quantity: 10 }

        const axiosResponse: AxiosResponse = {
            data: { ...product, id: "123" },
            status: 201, statusText: "Created", headers: {}, config: {}
        }

        // when
        supplyChainClientRestMock.createProduct.mockResolvedValue(axiosResponse)
        const expectedProduct = await sut.create(product)

        expect(expectedProduct).toEqual(product)
        expect(supplyChainClientRestMock.createProduct).toHaveBeenCalledTimes(1)
    });
});