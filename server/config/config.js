
//puerto

process.env.PORT = process.env.PORT || 3000;

//modo

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// conexion a mongo db
let urlDB;
if (process.env.NODE_ENV === 'dev')

    urlDB = "mongodb://localhost:27017/cafe"

else

    urlDB = process.env.MONGO_URI;

process.env.URLDB = urlDB;


//vencimiento del token

process.env.EXPIRE_TOKEN = process.env.EXPIRE_TOKEN  || '1h';


//token
process.env.SECRET = process.env.SECRET  || 'seed-desarrollo-alv';







