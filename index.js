const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
 const crypto = require('crypto');

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

  return res.status(200).json(talker);
} catch (error) { 
  return res.status(200).end();
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

// requisito 3

 app.post('/login', (req, res) => {
 const token = { token: `${crypto.randomBytes(8).toString('hex')}` };

  return res.status(HTTP_OK_STATUS).json(token);
 });

 // requisito 4 

app.listen(PORT, () => {
  console.log('Online');
});
