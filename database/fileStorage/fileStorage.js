const fs = require('fs');
const path = require('path');



class FileStore {

    storagePath = path.join(__dirname, 'storage.json');

    create = (feeConfigs) => {
        const fileData = fs.readFileSync(this.storagePath, { encoding: 'utf8' })
        const storedData = JSON.parse(fileData);
        const newData = storedData.concat(feeConfigs);
        fs.writeFile(this.storagePath, JSON.stringify(newData, null, 2), err => {
            if (err) throw new Error('Failed to save data')
        })

        return feeConfigs
    }

    getData = () => {
        const fileData = fs.readFileSync(this.storagePath, { encoding: 'utf8' })
        const storedData = JSON.parse(fileData);
        return storedData;

    }
}


module.exports = FileStore