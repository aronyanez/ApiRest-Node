

process.env.PORT = process.env.PORT || 3000;



process.env.NODE_ENV = process.env.NODE_ENV || 'dev';



let urlDB;
if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe'

else
    urlDB = 'mongodb+srv://mongocafe:2xPs3v2uSSjGVzK9@cluster0-jeexb.mongodb.net/cafe?retryWrites=true&w=majority';

process.env.URLDB = urlDB;






