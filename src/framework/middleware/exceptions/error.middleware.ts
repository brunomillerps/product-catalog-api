import ErrorException from "@domain/exceptions/ErrorException";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (
    error: Error | TypeError | ErrorException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof ErrorException) {
        response.status(error.status).send(error);
    } else {
        response.status(500).send({ code: StatusCodes.INTERNAL_SERVER_ERROR, status: 500, message: 'Unexpected error occurred. Try again later' });
    }
};