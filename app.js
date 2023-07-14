import express, { urlencoded } from "express";
import cookieParser, { signedCookie } from "cookie-parser";
import handlebars from "express-handlebars";
// import __dirname from './src/utils';
import session from "express-session";
import MongoStore from  'connect-mongo';
import mongoose from 'mongoose';


const app = express();

const url = 'mongodb+srv://machadolucasn:machaodlucasn@cluster0.imos5vy.mongodb.net/sessions_mongo?retryWrites=true&w=majority';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(url, options)
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
  });

app.use(cookieParser('coderparser'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
// app.use(express.static(__dirname+'/public'))
// app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars')
app.engine('handlbards', handlebars.engine());




app.use(session({
    secret:'coderhouse',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
    mongoUrl: 'mongodb+srv://machadolucasn:machadolucasn@cluster0.imos5vy.mongodb.net/sessions_mongo?retryWrites=true&w=majority',
    ttl:100, 
    mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}, 
    })
 
}));


app.get('/session', (req, res) => {
    if (!req.session.count) {
        req.session.count = 1;
        res.send('Bienvenido a la pagina');
        return;
    }

    req.session.count++;
    res.send(`Usted ha visitado la pagina ${req.session.count} veces`);
})






//// cookies

app.get('/setCookie', (req, res) => {
    res.cookie('coderCookie', 'esta es una buena cookie', { maxAge: 500000}).send('Cookie Seteada');

});

app.get('/infiniteCookie', (req, res) => {
    res.cookie('infiniteCookie', 'esta es una cookie INFINITA',).send('Cookie Infinita Seteada');
});
 
app.get('/getCookie', (req, res) => {
    const cookie = req.cookies;
    res.send({cookie,signedCookie: req.signedCookies}); 
});

app.get('/clearCookie', (req, res) => {
    res.clearCookie('coderCookie').send('Cookie Borrada');
});

app.get('/setSignedCookie', (req, res) => {
    res.cookie('SignedCookie', 'esta es una cookie bien signeada',{signed:true}).send('Cookie Signeada');

}); 
app.listen(8080, () => console.log('sv puerto 8080'));



