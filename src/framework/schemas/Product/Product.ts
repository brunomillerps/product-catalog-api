import { model, Schema } from 'mongoose';


interface IProduct {
    id: string,
    supplyChainId: string,
    name: string,
    price: number,
    quantity: number
}

const ProductSchema = new Schema<IProduct>({
    id: { type: String, unique: true, required: true },
    supplyChainId: { type: String, unique: true, required: true },
    name: { type: String, trim: true, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
})

const Product = model<IProduct>('Product', ProductSchema)

export default Product