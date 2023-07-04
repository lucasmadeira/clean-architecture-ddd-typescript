import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";


describe("Integration test create customer use case", () => {

    let sequelize : Sequelize;

    beforeEach(async () =>{
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: "memory",
            logging: false,
            sync: {force:true}
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();

    });

    afterEach(async () =>{
        await sequelize.close()
    });

    it("should create a product", async() =>{
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);

        const input = {
            name: "Product 1",
            price: 5.00
        }        

        const result = await useCase.execute(input);

        const productSave = await productRepository.find(result.id);

        expect(result.id).toEqual(productSave.id);
        expect(result.name).toEqual(productSave.name);
        expect(result.price).toEqual(productSave.price);
    })

    
});