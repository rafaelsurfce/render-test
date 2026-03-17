//const http = require('http');                                       importa módulo 
const express = require('express');
const requestLoggen = require('./middlewares/loggen');
const cors =  require('cors');
const app = express();                                                  //inicia a aplicação EXPRESS                                             

app.use(express.json());                                                //permite receber requisições/fomurlários JSON
app.use(requestLoggen);
app.use(cors());                                                        //permite receber e fazer requisições de outro domínio                             

const PORT = process.env.PORT || 3001;

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]


app.get('/', (request, response) => {                                   //ROTA RAIZ DA APLICAÇÃO REQUEST: RECEBE RESPONSE: RESPONDE
    response.send('<h1>Hello World!</h1>')  
});

app.get('/api/notes', (request, response) => {                          //ROTA PARA RESPONDER REQUISIÇÕES DAS NOTAS
    response.json(notes);
});


app.get('/api/notes/:id', (request, response) =>{                       //
    const id = Number(request.params.id);                               //REQUEST CAPTURA O VALOR SOLICITADO EM FORMATO STRING E CONVERTE PARA NUMBER PARA COMPARAÇÃO
    const note = notes.find(note => note.id === id);
    if(note){                                                           //VERIFICA SE A NOTA FOI ENCONTRADA SE SIM ENVIA
        response.json(note);
    }else{                                                              //SE NÃO HOUVER É ENVIADO UM CÓDIGO DE ERRO 
        response.status(404).end()
    }
    
});

app.delete('/api/notes/:id', (request, response) =>{
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);                       //refaz o array dos notes somente com as notas de ID diferente do ID enviado
    response.status(204).end();
});

app.post('/api/notes', (request, response) =>{

    const body = request.body;                                           // RESQUEST acessa o body para recuperar os dados enviados via POST

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)):0; //descobre o maior id da lista

    const note = {
        content: body.content,
        important: body.important,
        id: maxID + 1
    }
    
    notes = notes.concat(note);
    console.log(note);
    response.json(note);
})


/*app.listen(3000, ()=>{
    console.log(`Acesse: http://localhost:3000`);
});*/

app.listen(PORT, ()=>{
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
})


/*const app = http.createServer((request, response) =>{                 Usa o metodo CREATESERVER DO módulo importado
                                                                        para criar um servidor WEB  
    response.writeHead(200, {'Content-type': 'text/plain'});        
    response.end(JSON.stringify(notes));                            Transforma os objetos JavaScript em formato JSON e envia ao servidor 
});*/




/*app.listen(3000);                                                    faz com que o servidor receba requisições na porta 3001
console.log("Acesse o servidor: http://localhost:3000");  */          