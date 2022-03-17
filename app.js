const express = require('express')
const cors = require('cors');
const config = require('./config/config');
const errorMiddleware = require('./middlewares/error/error.middleware');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

class App {
    constructor() {
        this.app = express();


        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    //initialize middlewares
    initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    listen() {
        this.app.listen(config.connection.port, (err) => {
            if (err) console.log(err)
            console.log(`> Ready on ${config.connection.port}`);
        })
    }

    getServer() {
        return this.app;
    }

    //register routes
    initializeRoutes() {
        const routePath = './routes';
        fs.readdirSync(routePath).forEach(dir => {
            if (fs.statSync(`${routePath}/${dir}`).isDirectory()) {
                const filePath = `${routePath}/${dir}`;
                fs.readdirSync(filePath).forEach(route => {
                    const ControllerRoute = require(`${filePath}/${route}`);
                    const ctrlRoute = new ControllerRoute();
                    this.app.use('/', ctrlRoute.router)
                })
            }
        })

    }

    //initialize swagger
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'LANNISTERPAY SERVICE API',
                    version: '1.0.0',
                    description: 'Documentation for the fictional LannisterPay API endpoints',
                },
                host: config.connection.host,
                swagger: '2.0'
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    //error handling
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}



module.exports = App;