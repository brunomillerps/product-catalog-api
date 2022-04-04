import ErrorException from "@domain/exceptions/ErrorException";
import CreateProductUseCase from "@usecase/NewProduct/CreateProductUseCase";
import ICreateProductGateway from "@usecase/NewProduct/ICreateProductGateway";
import ProductDto from "@usecase/ProductDto";
import { NextFunction, Request, Response } from 'express';
import { v4 as uuiv4 } from 'uuid';
import CreateProductController from "./CreateProductController";

jest.mock('@usecase/NewProduct/CreateProductUseCase')
jest.mock('express')

const CreateProductUseCaseMock = CreateProductUseCase as jest.Mocked<typeof CreateProductUseCase>

const createProductGatewayMock: jest.Mocked<ICreateProductGateway> = {
    create: jest.fn()
}

const sutFactory = () => {
    const createProductUseCaseMock = new CreateProductUseCaseMock(createProductGatewayMock) as jest.Mocked<CreateProductUseCase>
    const sut = new CreateProductController(createProductUseCaseMock)

    return {
        sut,
        createProductUseCaseMock,
    }
}

describe('CreateProductController', () => {
    it('should return list of products', async () => {

        // given
        const { sut, createProductUseCaseMock } = sutFactory()

        const newProductDto: ProductDto = {
            name: "Product one",
            price: 2,
            quantity: 3
        }

        let responseObject = {}

        const next = () => { }
        const request = {}
        const response: Partial<Response> = {
            status: jest.fn().mockImplementation((result) => {
                return response
            }),
            send: jest.fn().mockImplementation((result) => {
                responseObject = result
            })
        }
        request['body'] = newProductDto

        const productId = uuiv4()

        createProductUseCaseMock.execute.mockResolvedValue({ ...newProductDto, id: productId })

        // when
        await sut.handle(request as Request, response as Response, next as NextFunction)

        // then
        expect(responseObject).toEqual({ ...newProductDto, id: productId })
        expect(createProductUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.send).toHaveBeenCalledTimes(1)
        expect(response.send).toHaveBeenCalledWith({ ...newProductDto, id: productId })
    });

    it('should throw error for use case', async () => {

        // given
        const { sut, createProductUseCaseMock } = sutFactory()

        const newProductDto: ProductDto = {
            name: "Product one",
            price: 2,
            quantity: 3
        }

        const next = jest.fn()
        const request = {}
        const response: Partial<Response> = {
            status: jest.fn(),
            send: jest.fn()
        }

        createProductUseCaseMock.execute.mockRejectedValue(new ErrorException("invalid input", 400))

        // when
        await sut.handle(request as Request, response as Response, next as NextFunction)

        //then
        expect(createProductUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.send).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
        expect(next).toHaveBeenCalledWith(new ErrorException("invalid input", 400))
    });
});