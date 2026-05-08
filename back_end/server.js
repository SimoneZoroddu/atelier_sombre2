const express = require("express");
const app = express();
const port = 3000;
const routes = require("./routes/routes");
const cors = require("cors");

app.listen(port, () => {
    console.log(`http://127.0.0.1:3000/`);
});

//cors middleware (see env file for FRONTENDED_URL)
app.use(cors({origin: process.env.FRONTENDED_URL,
    methods: ['GET', 'POST']}
));

//json middleware
app.use(express.json());

//routes
app.use("/", routes);



