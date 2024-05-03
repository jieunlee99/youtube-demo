const express = require("express");
const app = express();

app.listen(7777);

// user-demo를 외부 모듈처럼 사용할 수 있다.
const userRouter = require("./routes/users");

// channel-demo를 외부 모듈처럼 사용할 수 있다.
const channelRouter = require("./routes/channels");

app.use("/", userRouter);
app.use("/channels", channelRouter);
