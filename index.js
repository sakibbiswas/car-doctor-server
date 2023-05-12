const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('car doctor is running')
})
// sakibsakib99880
// P24tsbHsTl9CdRsf

app.listen(port, () => {
    console.log(` car API is running  on port : ${port}`)
})