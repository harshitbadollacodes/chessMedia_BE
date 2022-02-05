function routeNotFound(req, res) {
    res.status(404).json({
        success: false,
        message: "Route not found on server."
    });
}

module.exports = { routeNotFound };