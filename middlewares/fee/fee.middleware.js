const parser = require('../../validators/parser');
const HttpException = require('../../exceptions/httpException');


class FeeMiddleware {

    feeParser = (req, res, next) => {
        const { FeeConfigurationSpec } = req.body
        const feeParser = parser(FeeConfigurationSpec);
        if (feeParser.error) {
            throw new HttpException(400, feeParser.message)
        }
        res.feeConfigs = feeParser.data

        return next();
    }

    computeFeePayloadChecker = (req, res, next) => {
        const payload = req.body;
        if (Object.keys(payload).length < 1) throw new HttpException(400, 'Payload is required');
        if (payload.Currency !== 'NGN') throw new HttpException(400, `No fee configuration for ${payload.Currency} transactions.`)
        if (!payload.CurrencyCountry) throw new HttpException(400, 'Currency country is required');
        if (!payload.PaymentEntity) throw new HttpException(400, 'Payment entity is required');
        if (Object.prototype.toString.call(payload.PaymentEntity) != '[object Object]') throw new HttpException(400, 'Invalid field format for payment entity');
        if (!payload.PaymentEntity.Type) throw new HttpException(400, 'Payment entity type is required');
        if (!payload.Customer) throw new HttpException(400, 'Customer detail is required');
        if (Object.prototype.toString.call(payload.Customer) != '[object Object]') throw new HttpException(400, 'Invalid field format for customer details');
        if (typeof (payload.Customer.BearsFee) != 'boolean') throw new HttpException(400, 'BearsFee field must be boolean');
        if (isNaN(payload.Amount)) throw new HttpException(400, 'Amount of payment must be a number');
        if (payload.PaymentEntity.SixID && isNaN(payload.PaymentEntity.SixID)) throw new HttpException(400, 'SixID must be digit');
        if (payload.PaymentEntity.SixID && `${payload.PaymentEntity.SixID}`.length != 6) throw new HttpException(400, 'SixID must be six digits');


        res.payload = payload;
        return next();
    }
}


module.exports = FeeMiddleware;