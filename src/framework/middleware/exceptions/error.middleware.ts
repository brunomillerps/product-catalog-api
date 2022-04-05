import ErrorException from "@domain/exceptions/ErrorException";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    error: Error | TypeError | ErrorException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error instanceof ErrorException) {
        response.status(error.status).send(error);
    } else {
        response.status(500).send({ status: 500, message: 'Unexpected error occurred. Try again later' });
    }
};