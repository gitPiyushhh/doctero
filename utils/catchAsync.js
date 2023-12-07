module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err)) // next(err) sends err to global error handler
    }
}