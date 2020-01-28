const express = require('express');
const app = express();

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.render('home');
});

app.listen(3000,()=>{
    console.log('Server has started at PORT 3000');
});