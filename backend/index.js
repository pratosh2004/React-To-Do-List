const mongoose = require('mongoose');  // connecting monogodb
const express = require('express');// connecting express
const cors = require('cors');//connecting crosss origin
const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://pratosh2004:pratosh444@cluster0.cbp42al.mongodb.net/' , {
     useNewUrlParser : true,
     useUnifiedTopology: true
})   // connect -> express and mongo

    .then(() => {
        console.log('Connected to  database');
    })
    .catch((err) => {
        console.error(err);
    });

const DBSchema = new mongoose.Schema({         // schema is used to create schema

    todo: { type: String, require: true },        // key : type string 
}); 

const DBModel = mongoose.model('list', DBSchema);   // collection name , schema reference 

app.use(express.json());         //
app.use(cors());
app.post('/posting', async (req, resp) => {     // rounting parameter , function                
    try {
        const user = new DBModel(req.body);    // handles frontend string  
        const results = await user.save();        // datas will save  //insertone()
        const datasending = results.toObject();     // datas are changed to object 
        //text string
        // converting all datas to obj
        resp.send(datasending);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Something Went Wrong');
    }
});

app.get('/getting', async (req, resp) => {
    try {
        const users = await DBModel.find({}, 'todo');
        resp.json(users);
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to retrieve user data');
    }
});

app.put('/updating/:id', async (req, res) => {
    const { id } = req.params;
    const { todo } = req.body;

    try {
        const updatedTodo = await DBModel.findByIdAndUpdate(
            id,
            { todo },
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Failed to update todo:', error);
        res.status(500).send('Failed to update todo');
    }
});



app.delete('/deleting/:id', async (req, resp) => {
    try {
        const { id } = req.params;

        const result = await DBModel.findByIdAndDelete(id);

        if (!result) {
            return resp.status(404).send('Todo not found');
        }

        resp.send('Todo deleted successfully');
    } catch (e) {
        console.error(e);
        resp.status(500).send('Failed to delete todo');
    }
});

app.listen(port, () => {            /// app.listen(express, fucntion)
    console.log(`App is listening on port ${port}`);
});
