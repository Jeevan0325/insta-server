const express = require('express')
const app = express()
const port =4444
const mongoose = require('mongoose') 
const {MONGOURL} = require('./secret.js')
require('./models/user.js')
require('./models/post.js')


mongoose.connect(MONGOURL)
//for true case
mongoose.connection.on('connected',
    () => {console.log("connected to MongoDB")}
)

//for false case
mongoose.connection.on('error',
    (err) => {console.log("error connecting to MongoDB",err)}
)

app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/post.js'))


app.get('/',  
    (req, res) => {res.send('home page')}
)


    app.listen(port,()=>{console.log(`server is listening at port ${port}`)})