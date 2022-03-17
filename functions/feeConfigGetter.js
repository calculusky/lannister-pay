const specificityGetter = require("./specificityGetter");


/**
 * @method feeConfigGetter
 * @param {Object} payload 
 * @param {Array} feeConfigs 
 * @returns {Object}
 * @description returns the fee config for computation
 */



const feeConfigGetter = (payload, feeConfigs) => {
    const { PaymentEntity: paymentEntity } = payload;


    //extract entity properties of the payment
    const payloadEntityProps = {
        id: paymentEntity.ID,
        issuer: paymentEntity.Issuer,
        brand: paymentEntity.Brand,
        number: paymentEntity.Number,
        sixId: paymentEntity.SixID
    }
    const entityProps = Object.values(payloadEntityProps).filter(propValue => !!propValue);
    const specificityParams = { feeConfigs, payload, entityProps }
    const entityType = paymentEntity.Type

    const getConfig = specificityGetter(entityType, specificityParams);

    return getConfig;

}





module.exports = feeConfigGetter



