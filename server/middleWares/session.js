module.exports = (req, res, next) => {
    console.log(req.session.user)
    if (!req.session.user) {
        req.session.user = {
            messages: []
        };
    }
    next();
};