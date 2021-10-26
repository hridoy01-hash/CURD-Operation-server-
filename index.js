const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = 5000;



//midleware
app.use(cors());
app.use(express.json());

//connected database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6rclh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Main function
async function run(){
    try{
        await client.connect();
        const database = client.db('onlineCourse');
        const courseCollection = database.collection('courses');

        //GET API
        app.get('/courses',async(req,res)=>{
         const cursor = courseCollection.find({});
         const courses = await cursor.toArray();
         res.send(courses);       
        });

        //FIND A COURSE BY ID (GET API)

        app.get('/courses/:id',async(req,res)=>{
            const id = req.params.id;
            const query = { _id:ObjectId(id) }
            const course = await courseCollection.findOne(query);
            res.send(course);
        });

        //POST API

        app.post('/courses',async(req,res)=>{
            const course = req.body
            const result = await courseCollection.insertOne(course);
            res.json(result);
        });

        //DELETE API
        app.delete('/courses/:id',async(req,res)=>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await courseCollection.deleteOne(query);
            console.log('delete id ',result);
            res.json(result)
        });

        //UPDATE API
        app.put('/courses/:id',async(req,res)=>{
            const id = req.params.id;
            const updateCourse = req.body;
            const filter = {_id:ObjectId(id)}
            const updateDoc = {
                $set: {
                  courseName: updateCourse.courseName,
                  InstructorName:updateCourse.InstructorName,
                  CoursePrice:updateCourse.CoursePrice
                },
              };
            const result = await courseCollection.updateOne(filter,updateDoc);
            res.json(result);
        });



    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);



app.get('/',(req,res)=>{
    
    res.send('Review server is created done');
});

app.listen(port,()=>{
    console.log("Server Is Running",port);
})