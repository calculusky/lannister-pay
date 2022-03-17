

const errorMiddleware = (error, req, res, next) => {
    try {
        if (error instanceof SyntaxError) {
            console.log(error, '^^^^^')
            return res.status(400).json({
                message: 'Invalid body payload format',
            });
        }

        if (!error.status) {
            error.message = 'Internal server error';
            error.status = 500
        }
        const status = error.status;
        const message = error.message;
        return res.status(status).json({ message })

    } catch (error) {
        next(error)
    }
}



module.exports = errorMiddleware;