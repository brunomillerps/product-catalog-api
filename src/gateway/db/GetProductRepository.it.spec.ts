import Product from "@schemas/Product/Product";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import GetProductMongoDbRepository from "./GetProductRepository";

describe('IT - CreateProductMongoDbRepository', () => {

    beforeAll(async () => {
        if (!process.env.MONGO_URL) {
            throw new Error('MongoDB server not initialized')
        }

        await mongoose.connect(process.env.MONGO_URL)

    });

    afterAll((done) => {
        mongoose.connection.close(done)
    })

    it('should persist a product to database', async () => {
        // given
        const productId = uuidv4()
        const newproduct = {
            id: productId, supplyChainId: productId, name: "Product name", price: 10.98, quantity: 100
        }

        const product = new Product(newproduct)

        // when
        await product.save()

        // then
        const savedProduct = await new GetProductMongoDbRepository().getAll()

        expect(savedProduct).not.toBeFalsy()
        expect(savedProduct[0].id).toBe(productId)
        expect(savedProduct[0].name).toBe(newproduct.name)
        expect(savedProduct[0].price).toBe(newproduct.price)
        expect(savedProduct[0].quantity).toBe(newproduct.quantity)
    });
});