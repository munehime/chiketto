const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocs = require("./docs/openapi.json");
const { authJWT } = require("./middlewares");

// Setup multer
const upload = multer();

// Setup Environment Variables
require("dotenv").config();

// Initiate MongoDB Server
require("./models/connect.js");

// PORT
const PORT = process.env.PORT || 3000;

// Setup Express App
const app = express();

if(process.env.NODE_ENV !== "production") {
  // Setup SwaggerUI
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
}
// Setup Middlewares
// Setup Morgan
app.use(morgan("dev"));

// Setup Cors
const corsOption = {
  origin: [
    "http://localhost:4200", 
    "http://localhost:3001",
    "https://contest.webdevstudios.org",
    "https://contest.webdevstudios.org/",
    "https://webdev-contest-fe-admin.vercel.app/",
    "https://hackathon.webdevstudios.org",
    "https://hackathon.webdevstudios.org/"
  ],
};

app.use(cors(corsOption));

// Setup Cookies
app.use(cookieParser());

// Parse requests of content-type: application/json
app.use(express.json());

// Parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse requests of content-type: multipart/form-data
app.use(upload.array());

// Public Folder
app.use(express.static("public"));

// Routes
// All Routes
app.get("*", authJWT.checkUser);

// Landing Page
app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

//Router Middleware
require("./routes")(app);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} - ${process.env.NODE_ENV} mode`);
});
