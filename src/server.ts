import { connectDB } from "@middleware/mongodb.connect";
import { app } from "./app";

const port = process.env.PORT || 3000;


connectDB(() => {

    console.log("Database connected")

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    })
})