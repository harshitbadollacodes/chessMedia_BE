function errorHandler(error, req, res, next) {
  console.log(error);
  res.status(500).json({
        success: false, 
        message: "error generated. see the error messaage for more details", 
        errorMessage: error.message
    });
}

module.exports = { errorHandler };