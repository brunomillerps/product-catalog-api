import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ErrorException from "../../../../src/application/domain/exceptions/ErrorException";

export const errorHandler = (
    error: Error | TypeError | ErrorException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof ErrorException) {
        response.status(error.status).send(error);
    } else {
        response.status(500).send({ code: StatusCodes.INTERNAL_SERVER_ERROR, status: 500, message: error.message });
    }
};