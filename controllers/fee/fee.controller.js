const FeeService = require('../../services/fee/fee.service');
const HttpException = require('../../exceptions/httpException');
const { computeFee } = require('../../functions/computeFee');
//const feeComputation = requ

class FeeController {
    feeService = new FeeService();

    //create fee configuration controller
    createFee = async (req, res, next) => {
        const { feeConfigs } = res;

        try {

            this.feeService.createFee(feeConfigs);

            res.json({ status: "ok" })

        } catch (error) {
            console.log(error)
            next(error)
        }
    }


    //compute fee controller
    computeTransactionFee = async (req, res, next) => {
        const { payload } = res;
        try {
            const getFeeConfig = this.feeService.getFeeConfiguration(payload);

            if (getFeeConfig.error) throw new HttpException(404, getFeeConfig.errorMessage);

            const data = computeFee(getFeeConfig.data, payload);

            return res.json(data)

        } catch (error) {
            next(error)
        }
    }
}


module.exports = FeeController;