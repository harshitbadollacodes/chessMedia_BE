const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const { initializeDbConnection } = require("./data/db.connect");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const { errorHandler } = require("./middlewares/error-handler-middleware");
const { routeNotFound } = require("./middlewares/route-not-found-middleware");
const userRouter = require("./router/user.router");
const postRouter = require("./router/post.router");
const { verifyToken } = require("./middlewares/authenticateToken");

initializeDbConnection();

app.get("/", (req, res) => {
    res.json({ message: "Hello" });
});

app.use("/user", userRouter);
app.use("/posts", verifyToken, postRouter);

app.use(routeNotFound);
app.use(errorHandler);

const PORT = 5000;

app.listen(process.env.PORT || PORT, () => {
    console.log('server started');
});