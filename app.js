const express = require("express");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const scrapeRouter=require("./routers/scrapeRouter");
const contentRouter=require("./routers/constantRounter");


const PORT=3001;

app.use("/api/v1/",scrapeRouter);
app.use("/api/v1/constant/",contentRouter);


app.listen(PORT,()=>{console.log("app is running")});

module.exports = app;