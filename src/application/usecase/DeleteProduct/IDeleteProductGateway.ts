export default interface IDeleteProductGateway {
    delete(productId: string): Promise<boolean>
}