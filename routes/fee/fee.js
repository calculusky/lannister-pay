const express = require('express');
const { Router } = express;
const FeeController = require('../../controllers/fee/fee.controller');
const FeeMiddleware = require('../../middlewares/fee/fee.middleware');


class FeeRoute {
    constructor() {
        this.router = Router();
        this.feeMiddleware = new FeeMiddleware();
        this.feeController = new FeeController();
        this.initializeRoutes()
    }

    initializeRoutes() {
        this.router.post('/fee', this.feeMiddleware.feeParser, this.feeController.createFee);
        this.router.post('/compute-transaction-fee', this.feeMiddleware.computeFeePayloadChecker, this.feeController.computeTransactionFee);

    }
}


module.exports = FeeRoute;

