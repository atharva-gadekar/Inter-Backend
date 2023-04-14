import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { register } from "./controllers/auth.js"
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import { authenticateJWT } from "./middleware/verifyUser.js"
import { createBlog } from "./controllers/blog.js"
import blogRoute from "./routes/blog.js"
import searchRoute from "./routes/search.js"
import conversationRoute from "./routes/conversations.js";
import messageRoute from "./routes/messages.js";
import { getBlog } from "./controllers/blog.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));




const storage = multer.memoryStorage();
const upload = multer({ storage });


app.use("/auth/register", upload.single("pfp"), register);
app.use("/blog/create", authenticateJWT, upload.single("banner"), createBlog);

app.use("/auth", authRoute);
app.use("/blog", authenticateJWT, blogRoute);
app.use("/user", authenticateJWT, userRoute);
app.use("/blog/:id", getBlog);
app.use("/search", authenticateJWT, searchRoute);
app.use("/conversations", conversationRoute);
app.use("/messages", messageRoute);

//socketio work

  //port

  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
      .catch((error) => console.log(error.message));