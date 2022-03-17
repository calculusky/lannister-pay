/**
 * @method specificityGetter
 * @param {String} entityType 
 * @param {Object} param2 
 * @returns {Object}
 * @description returns the most specific fee config
 */



const specificityGetter = (entityType, { feeConfigs, payload, entityProps }) => {

    const generalConfig = feeConfigs.find(feeConfig => feeConfig.feeLocale == '*' && feeConfig.feeEntity == '*' && feeConfig.entityProperty == '*');

    const handleError = () => {
        return { error: true, errorMessage: 'No fee configuration for the transaction.' }
    }

    const handleData = (feeConfig) => {
        return { data: feeConfig }
    }

    //is there a config for the payload entity?
    const isPaymentEntity = feeConfigs.find(feeConfig => feeConfig.feeEntity == entityType);


    //CASE 1:: The payment entity could not be found in the fee configs
    if (!isPaymentEntity) {

        const isGeneralEntityConfigs = feeConfigs.find(feeConfig => feeConfig.feeEntity == '*');

        if (!isGeneralEntityConfigs) return handleError();

        const generalEntityConfigs = feeConfigs.filter(feeConfig => feeConfig.feeEntity == '*');

        //for local and international
        const generalEntityLocaleGetter = (locale) => {
            //check if there are the locale (local or intl) general payment entity configs
            const isLocaleGeneralEntity = generalEntityConfigs.find(feeConfig => feeConfig.feeLocale == locale);

            if (!isLocaleGeneralEntity) {

                const allLocaleGeneralEntityConfigs = generalEntityConfigs.find(feeConfig => feeConfig.feeLocale == '*' && feeConfig.entityProperty == '*');

                if (!allLocaleGeneralEntityConfigs) return handleError();

                return handleData(allLocaleGeneralEntityConfigs);

            }

            //the locale payment entity configs == true
            const theLocaleGeneralEntityConfigs = generalEntityConfigs.find(feeConfig => feeConfig.feeLocale == locale && feeConfig.entityProperty == '*');

            if (!theLocaleGeneralEntityConfigs) return handleError();

            return handleData(theLocaleGeneralEntityConfigs);
        }


        //is it a local transaction?
        if (payload.CurrencyCountry == payload.PaymentEntity.Country) return generalEntityLocaleGetter('LOCL');

        //international transaction == true
        return generalEntityLocaleGetter('INTL');

    }


    //CASE 2:: The payment entity present in fee configs

    //load all specified payment entity configs
    const paymentEntityConfigs = feeConfigs.filter(feeConfig => feeConfig.feeEntity == entityType);


    //for local and international
    const paymentEntityLocaleGetter = (locale) => {
        //check if there are locale payment entity configs   
        const isLocaleEntity = paymentEntityConfigs.find(feeConfig => feeConfig.feeLocale == locale);

        if (!isLocaleEntity) {
            //is there general locale config for the entity and its property?
            const allLocalesEntityAndPropConfig = paymentEntityConfigs.find(feeConfig => feeConfig.feeLocale == '*' && entityProps.includes(feeConfig.entityProperty));

            //----------no general locale config for the entity and its property------------
            if (!allLocalesEntityAndPropConfig) {
                //is there general locale config for the entity and any property?
                const allLocalesEntityAndAnyPropConfig = paymentEntityConfigs.find(feeConfig => feeConfig.feeLocale == '*' && feeConfig.entityProperty == '*');

                //----------no general locale config for the entity and general entity-property------------
                if (!allLocalesEntityAndAnyPropConfig) {
                    //check if there is general config
                    if (!generalConfig) return handleError();

                    return handleData(generalConfig)
                }

                return handleData(allLocalesEntityAndAnyPropConfig);
            }

            return handleData(allLocalesEntityAndPropConfig);

        }

        //--------- The locale transaction entity exists -----------
        //load all the locale configs
        const theLocalePaymentEntity = paymentEntityConfigs.filter(feeConfig => feeConfig.feeLocale == locale);

        //does the fee Config contains the payload entity property? 
        const specificFeeConfig = theLocalePaymentEntity.find(feeConfig => entityProps.includes(feeConfig.entityProperty));

        if (!specificFeeConfig) {
            //does general entity prop exists om the entity? 
            const generalEntityPropFeeConfig = theLocalePaymentEntity.find(feeConfig => feeConfig.entityProperty == '*');

            if (!generalEntityPropFeeConfig) {
                //check if there is general config
                if (!generalConfig) return handleError();

                return handleData(generalConfig)

            }

            return handleData(generalEntityPropFeeConfig);

        }

        return handleData(specificFeeConfig)
    }


    //is it a local transaction?
    if (payload.CurrencyCountry == payload.PaymentEntity.Country) return paymentEntityLocaleGetter('LOCL');

    //international transaction == true
    return paymentEntityLocaleGetter('INTL');

}


module.exports = specificityGetter