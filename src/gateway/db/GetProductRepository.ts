
import Product from "@schemas/Product/Product";
import IGetProductsRepository from "@usecase/GetProducts/IGetProductRepository";
import ProductDto from "@usecase/ProductDto";

export default class GetProductMongoDbRepository implements IGetProductsRepository {

    async getAll(): Promise<ProductDto[]> {
        const all = await Product.find({}).exec()
        return JSON.parse(JSON.stringify(all)) as ProductDto[];
    }
}