
import Product from "@schemas/Product/Product";
import ICreateProductRepository from "@usecase/NewProduct/ICreateProductRepository";
import ProductDto from "@usecase/ProductDto";

export default class CreateProductMongoDbRepository implements ICreateProductRepository {

    create(product: ProductDto): Promise<ProductDto> {

        const newProduct = new Product({ ...product })
        newProduct.supplyChainId = product.id

        // when
        return newProduct.save().then((it) => {
            return <ProductDto>{
                id: it.id,
                name: it.name,
                price: it.price,
                quantity: it.quantity
            }
        })
    }
}