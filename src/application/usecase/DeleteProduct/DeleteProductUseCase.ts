import { InvalidProductIdException } from '@domain/exceptions/InvalidProductIdException';
import { validate as isValidUUID } from 'uuid';
import IDeleteProductGateway from "./IDeleteProductGateway";

export default class DeleteProductUseCase {

    constructor(private readonly deleteProductGateway: IDeleteProductGateway) { }

    public async execute(productId: string): Promise<boolean> {
        if (!isValidUUID(productId)) {
            throw new InvalidProductIdException(productId)
        }
        return await this.deleteProductGateway.delete(productId)
    }
}