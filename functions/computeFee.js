
/**
 * @method computeFee
 * @param {Object} feeConfig 
 * @param {Object} payload
 * @description compute the fee from the fee configuration
 */


const computeFee = (feeConfig, payload) => {
    const { Amount: amount, Customer: { BearsFee: bearsFee } } = payload;
    const { feeID, feeValue, percValue, flatValue } = feeConfig;


    const computeOthers = (data) => {
        if (bearsFee) {
            const chargeAmount = amount + data.AppliedFeeValue
            data.ChargeAmount = chargeAmount
        } else {
            data.ChargeAmount = amount
        }
        data.SettlementAmount = data.ChargeAmount - data.AppliedFeeValue;
        return data;
    }

    const data = {
        AppliedFeeID: feeID,
    }


    //for flat_perc
    if (feeConfig.feeType == 'FLAT_PERC') {
        const appliedFee = +flatValue + ((percValue * +amount) / 100);
        data.AppliedFeeValue = appliedFee;
        return computeOthers(data)

    }

    //for perc
    if (feeConfig.feeType == 'PERC') {
        const appliedFee = (feeValue * +amount) / 100;
        data.AppliedFeeValue = appliedFee;
        return computeOthers(data)
    }

    //for flat
    data.AppliedFeeValue = feeValue;
    return computeOthers(data)

}





module.exports = {
    computeFee
}