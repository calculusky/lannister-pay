
const { PORT, HOST } = process.env;


//env variables
const connection = {
    port: PORT || 5000,
    host: HOST
}


module.exports = {
    connection
}