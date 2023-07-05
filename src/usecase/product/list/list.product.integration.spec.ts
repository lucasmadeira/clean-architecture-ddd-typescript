import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";


describe("Integration test list product use case", () => {

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

    it("should list  products", async() =>{
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);

            

        const product = ProductFactory.create("a", "Product 1", 5.00);
        const product2 = ProductFactory.create("a", "Product 2", 10.00);
        await productRepository.create(product);
        await productRepository.create(product2);

        const result = await useCase.execute({});

        
        expect(result.products[0].id).toEqual(product.id);
        expect(result.products[0].name).toEqual(product.name);
        expect(result.products[0].price).toEqual(product.price);
        expect(result.products[1].id).toEqual(product2.id);
        expect(result.products[1].name).toEqual(product2.name);
        expect(result.products[1].price).toEqual(product2.price);
    })

    
});