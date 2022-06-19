const express = require('express')
const {initializeDB} = require('./database/db.connect')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const postRoute = require('./routes/post.route')
const userRoute = require('./routes/user.route')


dotenv.config()
initializeDB()
app.use(cors())
app.use(express.json())


app.use('/post',postRoute)
app.use('/user',userRoute)

app.get('/', (req, res) => {
  res.send('Cryptoworld backend server!')
})


// 404 Route - should always be at the end
app.use((req,res)=>{
    res.json({success:false,message:"404 - route not found"})
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})