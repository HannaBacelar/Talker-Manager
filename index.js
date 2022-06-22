const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
 const crypto = require('crypto');
 const validaEmail = require('./validaEmail');
const validaSenha = require('./validaSenha');
const validaAuthorization = require('./validaAutorização');
const validaname = require('./validaName');
const validaAge = require('./validaAge');
const validaTalk = require('./validaTalk');
const validaWatchedAt = require('./validaWatchedAt');
const validaRate = require('./validaRate');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// começando projeto aqui 
 // requisito 1 
function getTalker() {
  return fs.readFile('./talker.json', 'utf-8')
  .then((fileContent) => JSON.parse(fileContent));
}

app.get('/talker', async (req, res) => {
try {
  const talker = await getTalker();

  return res.status(HTTP_OK_STATUS).json(talker);
} catch (error) { 
  return res.status(HTTP_OK_STATUS).end();
}
});

// requsiito 2 

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
    const talkerId = await getTalker();

    const talkerId2 = talkerId.find((element) => element.id === +id);

    if (!talkerId2) { 
      return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    } 
    return res.status(HTTP_OK_STATUS).json(talkerId2);
});

// requisito 3 e 4

 app.post('/login', validaEmail, validaSenha, (req, res) => {
 const token = { token: `${crypto.randomBytes(8).toString('hex')}` };
  return res.status(HTTP_OK_STATUS).json(token); 
 });

// requisito 5
function escreveArquivo(addNovoTalker) {
   return fs.writeFile('./talker.json', JSON.stringify(addNovoTalker));
}
app.use(validaAuthorization);

app.post('/talker',
validaname, 
validaAge,
validaTalk,
validaWatchedAt,
validaRate, async (req, res) => {
const { name, age, talk } = await req.body;
const talkers = await getTalker();
const id = talkers.length + 1;
const novoTalker = { id, 
  name,
  age, 
  talk,
};
const spreadTalker = [...talkers, novoTalker];
await escreveArquivo(spreadTalker);
return res.status(201).json(novoTalker);
});
// requisito 6 

app.put('/talker/:id', 
validaname, 
validaAge,
validaTalk,
validaWatchedAt,
validaRate, async (req, res) => {
const { id } = req.params;
const { name, age, talk } = req.body;
const idTalker = await getTalker();
const findTalker = idTalker.map((element) => {
 if (element.id === +id) {
 return { id: +id, name, age, talk,
  }; 
}
return element;
});
await escreveArquivo(findTalker);
return res.status(200).json({ id: +id,
  name,
  age,
  talk,
});
});

// requisito 7 

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const idTalker = await getTalker();
  const findTalker = idTalker.findIndex((e) => e.id === +(id));
  await escreveArquivo(findTalker);
  return res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
