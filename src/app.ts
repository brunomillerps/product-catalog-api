import express from "express";

const app = express();

app.get('/', (_, res) => {
    return res.json({
        greeting: 'Hello World!!!@'
    })
})

app.listen(3000, () => {
    console.log("Application listening on port 3000")
})