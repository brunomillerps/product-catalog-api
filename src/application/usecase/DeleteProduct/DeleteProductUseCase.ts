import IDeleteProductGateway from "./IDeleteProductGateway";

export default class DeleteProductUseCase {

    constructor(private readonly deleteProductGateway: IDeleteProductGateway){}

    public async execute(productId: string): Promise<boolean> {
        return await this.deleteProductGateway.delete(productId)
    }
}