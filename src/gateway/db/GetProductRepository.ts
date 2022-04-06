
import Product from "@schemas/Product/Product";
import IGetProductsRepository from "@usecase/GetProducts/IGetProductRepository";
import ProductDto from "@usecase/ProductDto";

export default class GetProductMongoDbRepository implements IGetProductsRepository {

    async get(productId: string): Promise<ProductDto> {
        const item = await Product.find({ id: productId }).exec()
        return JSON.parse(JSON.stringify(item))[0] as ProductDto
    }

    async getAll(): Promise<ProductDto[]> {
        const all = await Product.find({}).exec()
        return JSON.parse(JSON.stringify(all)) as ProductDto[]
    }
}