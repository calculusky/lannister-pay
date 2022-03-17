const App = require('../app');
const request = require('supertest');
const fs = require('fs')
const FileStore = require('../database/fileStorage/fileStorage');


const computationPayloadData = {
    ID: "91203",
    Amount: 5000,
    Currency: "NGN",
    CurrencyCountry: "NG",
    Customer: {
        ID: "2211232",
        EmailAddress: "anonimized29900@anon.io",
        FullName: "Abel Eden",
        BearsFee: false
    },
    PaymentEntity: {
        ID: "2203454",
        Issuer: "GTBANK",
        Brand: "MASTERCARD",
        Number: "530191******2903",
        SixID: "301917",
        Type: "CREDIT-CARD",
        Country: "NG"
    }
}


describe('Testing Successful fee creation and fee computation', () => {
    afterAll(() => {
        const store = new FileStore();
        fs.writeFileSync(store.storagePath, JSON.stringify([], null, 2))
    })

    describe('[POST] /fee', () => {
        it('response should return status of 200 for the created fee configurations', async () => {
            const app = new App()
            const resData = { status: 'ok' }

            const payloadData = {
                FeeConfigurationSpec: "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0"
            }


            const { statusCode, body } = await request(app.getServer()).post('/fee').send(payloadData);

            expect(statusCode).toBe(200);

            expect(body).toEqual(resData);

        })
    })

    describe('[POST] /compute-transaction-fee', () => {

        it('response should return the applied fee details', async () => {
            const app = new App()

            const { body } = await request(app.getServer()).post('/compute-transaction-fee').send(computationPayloadData);

            console.log(body)

            expect(body).toMatchObject({
                AppliedFeeID: expect.any(String),
                AppliedFeeValue: expect.any(Number),
                ChargeAmount: expect.any(Number),
                SettlementAmount: expect.any(Number)
            })
        })
    })

})

describe('Testing unsuccessful fee creation and computation', () => {

    describe('[POST] /fee', () => {
        it('Create fee should fail if the payload is not well formatted or missing values', async () => {
            const app = new App()

            const payloadData = {
                FeeConfigurationSpec: "LNPY1221444444 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0"
            }

            return request(app.getServer()).post('/compute-transaction-fee').send(payloadData).expect(400);

        })
    })


    describe('[POST] /compute-transaction-fee', () => {
        beforeAll(() => {
            const store = new FileStore();
            fs.writeFileSync(store.storagePath, JSON.stringify([], null, 2))
        })

        it('response should return status of not found for no matching fee configuration', async () => {
            const app = new App()

            return request(app.getServer()).post('/compute-transaction-fee').send(computationPayloadData).expect(404);

        })
    })
})


