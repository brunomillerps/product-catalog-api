import ProductDto from '@usecase/ProductDto';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import nock from 'nock';
import supertest, { Response, SuperAgentTest } from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import { app } from '../../../src/app';

describe('IT - Products API', () => {
    let request: SuperAgentTest = null
    let server: Server
    const scope: nock.Scope = nock('https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com')

    beforeAll(function (done) {
        server = app.listen(done)
        request = supertest.agent(server)
    })

    afterAll(function (done) {
        server.close(done)
    })

    const basePath = '/api/v1/products'

    it('should get a list of products via rest API', async () => {

        const responseMock = {
            bundle: [
                {
                    "quantity": 6,
                    "id": "bfc022a5-c239-45f5-bb35-f88023b669ce",
                    "price": "23.65",
                    "name": "Prod 00033"
                },
                {
                    "quantity": 5,
                    "id": "88c5db61-4501-4e38-bf8c-29a6626766e1",
                    "price": 12.34,
                    "name": "testing 123"
                },
                {
                    "quantity": 5,
                    "id": "e1967066-d9c6-4f80-a202-190cd77d216f",
                    "price": 12.34,
                    "name": "testing 123"
                }]
        }

        scope
            .get('/test/supply-chain')
            .reply(200, responseMock)

        const response: Response = await request
            .get(basePath)
            .send()

        expect(response.body).toEqual([{ "id": "bfc022a5-c239-45f5-bb35-f88023b669ce", "name": "Prod 00033", "price": "23.65", "quantity": 6 }, { "id": "88c5db61-4501-4e38-bf8c-29a6626766e1", "name": "testing 123", "price": 12.34, "quantity": 5 }, { "id": "e1967066-d9c6-4f80-a202-190cd77d216f", "name": "testing 123", "price": 12.34, "quantity": 5 }])
    });


    it('should create a product via POST', async () => {

        const body = <ProductDto>{
            name: "Product B",
            price: 100,
            quantity: 39
        }

        nock('https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com')
            .post('/test/supply-chain', { ...body })
            .reply(201, { ...body, id: '12345' })

        const response: Response = await request
            .post(basePath)
            .send(body)

        expect(response.body).toEqual({ ...body, id: '12345' })

    });

    it('should return 422 for invalid entity when POST', async () => {

        const body = <ProductDto>{
            price: 100,
            quantity: 39
        }

        nock('https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com')
            .post('/test/supply-chain', { ...body })
            .reply(201, { ...body, id: '12345' })

        const response: Response = await request
            .post(basePath)
            .send(body)

        expect(response.status).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
        expect(response.text).toBe('Error validating request body. "name" is required.')

    });

    it('should DELETE a product', async () => {

        const id = uuidv4()
        nock('https://ev5uwiczj6.execute-api.eu-central-1.amazonaws.com')
            .delete(`/test/supply-chain/${id}`)
            .reply(StatusCodes.NO_CONTENT)

        const response: Response = await request
            .delete(basePath + `/${id}`)
            .send()

        expect(response.status).toBe(StatusCodes.NO_CONTENT)

    });
});