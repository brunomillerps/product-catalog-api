import ErrorException from "@domain/exceptions/ErrorException";
import GetAllProductsUseCase from "@usecase/GetProducts/GetAllProductsUseCase";
import IGetAllProductsGateway from "@usecase/GetProducts/IGetProductsGateway";
import ProductDto from "@usecase/ProductDto";
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from 'uuid';
import GetAllProductsController from "./GetAllProructsController";

jest.mock('@usecase/GetProducts/GetAllProductsUseCase')
jest.mock('express')

const GetAllProductsUseCaseMock = GetAllProductsUseCase as jest.Mocked<typeof GetAllProductsUseCase>

const getAllProductsGateway: jest.Mocked<IGetAllProductsGateway> = {
    getAll: jest.fn()
}

const sutFactory = () => {
    const getAllProductsUseCaseMock = new GetAllProductsUseCaseMock(getAllProductsGateway) as jest.Mocked<GetAllProductsUseCase>
    const sut = new GetAllProductsController(getAllProductsUseCaseMock)

    return {
        sut,
        getAllProductsUseCaseMock,
    }
}

describe('GetAllProductsController', () => {
    it('should return a list of produts', async () => {

        // given
        const { sut, getAllProductsUseCaseMock } = sutFactory()

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

        const products: ProductDto[] = [
            { name: "Product A", price: 99.9, quantity: 10, id: uuidv4() },
            { name: "Product B", price: 8.1, quantity: 1, id: uuidv4() }
        ]

        // when
        getAllProductsUseCaseMock.execute.mockResolvedValue(products)

        await sut.handle(request as Request, response as Response, next as NextFunction)

        // then
        expect(getAllProductsUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.status).toHaveBeenCalledTimes(1)
        expect(response.status).toHaveBeenCalledWith(StatusCodes.OK)
        expect(response.send).toHaveBeenCalledTimes(1)
        expect(response.send).toHaveBeenCalledWith(products)
    });

    it('should catch exception when use case throws', async () => {

        // given
        const { sut, getAllProductsUseCaseMock } = sutFactory()

        const productId = uuidv4()

        const next = jest.fn()
        const request: Partial<Request> = {
            params: {
                productId: productId
            }
        }
        const response: Partial<Response> = {
            sendStatus: jest.fn()
        }

        // when
        getAllProductsUseCaseMock.execute.mockRejectedValue(new ErrorException("invalid", 400))

        await sut.handle(request as Request, response as Response, next as NextFunction)

        // then
        expect(getAllProductsUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.sendStatus).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });
});