import ErrorException from "@domain/exceptions/ErrorException";
import DeleteProductUseCase from "@usecase/DeleteProduct/DeleteProductUseCase";
import IDeleteProductGateway from "@usecase/DeleteProduct/IDeleteProductGateway";
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { v4 as uuiv4 } from 'uuid';
import DeleteProductController from "./DeleteProductController";

jest.mock('@usecase/DeleteProduct/DeleteProductUseCase')
jest.mock('express')

const DeleteProductUseCaseMock = DeleteProductUseCase as jest.Mocked<typeof DeleteProductUseCase>

const deleteProductGatewayMock: jest.Mocked<IDeleteProductGateway> = {
    delete: jest.fn()
}

const sutFactory = () => {
    const deleteProductUseCaseMock = new DeleteProductUseCaseMock(deleteProductGatewayMock) as jest.Mocked<DeleteProductUseCase>
    const sut = new DeleteProductController(deleteProductUseCaseMock)

    return {
        sut,
        deleteProductUseCaseMock,
    }
}

describe('DeleteProductController', () => {
    it('should delete a product', async () => {

        // given
        const { sut, deleteProductUseCaseMock } = sutFactory()

        const productId = uuiv4()

        const next = () => { }
        const request: Partial<Request> = {
            params: {
                productId: productId
            }
        }
        const response: Partial<Response> = {
            sendStatus: jest.fn()
        }

        request['params']['productId'] = productId

        // when
        deleteProductUseCaseMock.execute.mockResolvedValue(true)
        await sut.handle(request as Request, response as Response, next as NextFunction)

        // then
        expect(deleteProductUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.sendStatus).toHaveBeenCalledTimes(1)
        expect(response.sendStatus).toHaveBeenCalledWith(StatusCodes.NO_CONTENT)
    });

    it('should catch exception when use case throws', async () => {

        // given
        const { sut, deleteProductUseCaseMock } = sutFactory()

        const productId = uuiv4()

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
        deleteProductUseCaseMock.execute.mockRejectedValue(new ErrorException("invalid product id", 400))

        await sut.handle(request as Request, response as Response, next as NextFunction)

        // then
        expect(deleteProductUseCaseMock.execute).toHaveBeenCalledTimes(1)
        expect(response.sendStatus).toHaveBeenCalledTimes(0)
        expect(next).toHaveBeenCalledTimes(1)
    });
});