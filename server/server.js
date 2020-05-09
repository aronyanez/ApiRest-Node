require('./config/config')

const express = require('express')


const app = express();

const bodyParser = require('body-parser')


const mongoose = require('mongoose');




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



const routes = require('./routes/index');
app.use('/api', routes);


(async () => {
    try {
        const conn = await mongoose.connect(process.env.URLDB, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log('base de datos ONLINE');
    } catch (err) {
        console.log('No se pudo conectar', err);
    }
}
)();




app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", 3000)
});


