const validator = require('validator');



/**
 * @method feeParser
 * @param {String} feeInput 
 * @returns {Object}
 * @description parses the payload fee input configuration
 */

const feeParser = (feeInput) => {

    //returns error message for invalid field
    const feeParserError = (type) => {
        return {
            error: true,
            message: `Invalid field value for ${type}`
        }
    }

    //initialize checks
    let dualFeeValue = false;
    let theFlatValue = null;
    let thePercValue = null;
    let theSingleFeeValue = null

    //valid payment entities
    const validPaymentEntities = ['CREDIT-CARD', 'DEBIT-CARD', 'BANK-ACCOUNT', 'USSD', 'WALLET-ID', '*'];


    try {
        const feeConfigs = feeInput.split('\n');
        const data = [];
        for (let feeConfig of feeConfigs) {

            //validate apply keyword
            if (!feeConfig.includes('APPLY')) return { error: true, message: 'Invalid payload format' }

            const [feeDet1, feeDet2] = feeConfig.split('APPLY');
            const [feeID, feeCurrency, feeLocale, feeEntityPart, colon, space] = feeDet1.split(' ');
            const [empty, feeType, feeValue] = feeDet2.split(' ');


            //validate fields

            if (colon !== ':' || space != '' || empty != '') return { error: true, message: 'Invalid payload format' }

            //validating fee ID
            if (!(validator.isAlphanumeric(feeID) && feeID.length === 8)) {
                return feeParserError('{FEE-ID}')
            }

            //validating fee currency
            if (!(feeCurrency === 'NGN' || feeCurrency === 'USD' || feeCurrency === '*')) return feeParserError('{FEE-CURRENCY}')

            //validate fee locale
            if (!(feeLocale === 'LOCL' || feeLocale === 'INTL' || feeLocale === '*')) return feeParserError('{FEE-LOCALE}');

            //validate fee entity and entity property field
            const [feeEntity, entityProperty] = feeEntityPart.slice(0, feeEntityPart.length - 1).split('(');
            //fee entity
            if (!validPaymentEntities.includes(feeEntity)) return feeParserError('{FEE-ENTITY}');
            //fee entity property
            if (!entityProperty) return feeParserError('{ENTITY-PROPERTY}')

            //validate fee type
            if (!(feeType === 'FLAT' || feeType === 'PERC' || feeType === 'FLAT_PERC')) return feeParserError('{FEE-TYPE}');

            //validate fee value
            if (!feeValue) return feeParserError('{FEE-VALUE}')

            if (feeValue.includes(':')) {
                //does the fee value matches the fee type?
                if (feeType !== 'FLAT_PERC') return { error: true, message: 'FEE-VALUE unsupported for the FEE-TYPE' };

                //validate the value
                dualFeeValue = true;
                const [flatValue, percValue] = feeValue.split(':');
                if (isNaN(flatValue) || isNaN(percValue)) return feeParserError('{FEE-VALUE}');
                theFlatValue = +flatValue;
                thePercValue = +percValue;
                theSingleFeeValue = null;

            } else {

                //does the fee value matches the fee type?
                if (!(feeType === 'FLAT' || feeType === 'PERC')) return { error: true, message: 'FEE-VALUE unsupported for the FEE-TYPE' };

                //validate the value
                if (!feeValue || isNaN(feeValue) || feeValue < 0) return feeParserError('{FEE-VALUE}');
                theSingleFeeValue = +feeValue
                theFlatValue = null;
                thePercValue = null;
            }

            //validation passed
            const obj = {
                feeID,
                feeCurrency,
                feeLocale,
                feeEntity,
                entityProperty,
                feeType,
                flatValue: theFlatValue,
                percValue: thePercValue,
                feeValue: theSingleFeeValue
            }

            data.push(obj)

        }

        return { error: false, data }

    } catch (error) {
        console.log(error, 'err')
        return {
            error: true,
            message: 'Invalid payload format'
        }
    }


}




module.exports = feeParser;