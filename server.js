const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'buildings'

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req,res)=>{
    const buildings = await db.collection('buildings').find().toArray()
    const buildingsLeft = await db.collection('buildings').countDocuments({completed: false})
    res.render('index.ejs', {zebra: buildings, left: buildingsLeft})
})

app.post('/createBuilding', (req, res)=>{
    db.collection('buildings').insertOne({building: req.body.buildingName, rooms: req.body.buildingRooms, completed: false})
    .then(result =>{
        console.log('Building has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{
    db.collection('buildings').updateOne({building: req.body.rainbowUnicorn},{
        $set: {
            completed: true
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res)=>{
    db.collection('buildings').updateOne({building: req.body.rainbowUnicorn},{
        $set: {
            completed: false
        }
    })
    .then(result =>{
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.delete('/deleteBuilding', (req, res)=>{
    db.collection('buildings').deleteOne({building: req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Building')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})
 
app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    