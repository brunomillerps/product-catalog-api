import { ProductNotFoundException } from "@domain/exceptions/ProductNotFound";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "./error.middleware";


const next = () => { }
const request = {}
const response: Partial<Response> = {
    status: jest.fn().mockImplementation((result) => {
        return response
    }),
    send: jest.fn().mockImplementation((result) => {
    })
}

describe('errorHandler', () => {
    it('should threat application exception', () => {
        errorHandler(new ProductNotFoundException('12'), request as Request, response as Response, next as NextFunction)

        expect(response.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND)
    });

    it('should throw 500 status code when error is unknow', () => {
        errorHandler(new Error('general exception'), request as Request, response as Response, next as NextFunction)

        expect(response.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    });
});