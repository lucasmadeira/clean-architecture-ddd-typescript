import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "../create/create.product.usecase";
import UpdateProductUseCase from "./update.product.usecase";


describe("Integration test update product use case", () => {

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

    it("should update a product", async() =>{
        const productRepository = new ProductRepository();
        const useCaseUpdate = new UpdateProductUseCase(productRepository);


        const product = ProductFactory.create("a", "Product 1", 5.00);
        await productRepository.create(product);        
        let productSave = await productRepository.find(product.id);

        const inputUpdate = {
            id: productSave.id,
            name: "Product Update",
            price: productSave.price * 2
        }

        const resultUpdate = await useCaseUpdate.execute(inputUpdate);

        productSave = await productRepository.find(product.id);

        expect(resultUpdate.id).toEqual(productSave.id);
        expect(resultUpdate.name).toEqual(productSave.name);
        expect(resultUpdate.price).toEqual(productSave.price);
    })

    
});