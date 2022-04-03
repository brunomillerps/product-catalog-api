export class Product {

    private quantity: number
    private id: string
    private price: number
    private name: string

    constructor(props: Omit<Product, 'id'>, id?: string) {
        Object.assign(this, props)
        if (id) {
            this.id = id
        }
    }
}