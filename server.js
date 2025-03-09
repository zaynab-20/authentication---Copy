require('./config/dataBase')
const express = require('express')

const PORT = process.env.PORT || 1414

const userRouter = require('./routes/userRouter')


const app = express()
app.use(express.json())

app.use('/api/v1', userRouter)



app.listen(PORT, ()=>{
      console.log(`server is running on port ${PORT}`);
      
})