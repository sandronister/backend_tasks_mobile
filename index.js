const app = require('express')()
const bodyParse = require('body-parser')

app.use(bodyParse.json())

app.get('/',(req,res)=>{
    res.status(200).send('<h1>Meu Backend</h1>')
})

app.get('/blabla/:id',(req,res)=>{
    res.status(200).send('<h1>Meu Backend</h1>'+req.params.id+'--query'+req.query.name)
    console.log(req.params)
})

app.post('/save',(req,res)=>{
    res.status(200).send('Foi '+req.body.sobrenome)
})

app.listen(3000,function(){
    console.log('Backend Executando')
})

