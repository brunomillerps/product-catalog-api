import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import Product from "./Product";

describe('IT - Product Schema', () => {

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
        const savedProduct = await Product.findOne({ id: productId }).exec()

        expect(savedProduct.$isEmpty).not.toBeFalsy()
        expect(savedProduct.id).toBe(newproduct.id)
        expect(savedProduct.name).toBe(newproduct.name)
        expect(savedProduct.price).toBe(newproduct.price)
        expect(savedProduct.quantity).toBe(newproduct.quantity)
    });
});