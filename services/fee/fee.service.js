
const feeConfigGetter = require('../../functions/feeConfigGetter');
const FileStore = require('../../database/fileStorage/fileStorage');


class FeeService {

    store = new FileStore()

    //create fee
    createFee = (feeConfigs) => {

        return this.store.create(feeConfigs);
    }

    //get fee config
    getFeeConfiguration = (payload) => {
        const feeConfigs = this.store.getData();
        return feeConfigGetter(payload, feeConfigs)
    }
}


module.exports = FeeService