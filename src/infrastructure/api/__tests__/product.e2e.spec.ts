import {app, sequelize} from '../express';
import request from "supertest"; 

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll( async () => {
        await sequelize.close();
    });

    it("should create a product", async() => {

        try{
            const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 10.00,
            })

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.price).toBe(10.00);
        }catch(error){
            console.log(error);
        }    

        
    });

    it("should not creat a product", async() => {

        try{
            const response = await  request(app).post("/product").send({
                name: "Product 1",
            })
    
            expect(response.status).toBe(500);
        }catch(error){
            console.log(error);
        }    
        
    })

    it("should list all product", async() => {

        try{
            const response = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 10.00
            })

            expect(response.status).toBe(200);

            const response2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                price: 15.00
            })

            expect(response2.status).toBe(200);

            const listResponse = await request(app).get("/product").send();
            expect(listResponse.status).toBe(200);

            expect(listResponse.body.products.length).toBe(2);
            const product = listResponse.body.products[0];
            expect(product.name).toBe("Product 1");
            expect(product.price).toBe(10.00);
            const product2 = listResponse.body.products[1];
            expect(product2.name).toBe("Product 2");
            expect(product2.price).toBe(15.00)
        }catch(error){
            console.log(error);
        }

        
    })

});