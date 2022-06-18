const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

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
  .then((conteudoarquivo) => JSON.parse(conteudoarquivo));
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
    const talkerId = await getTalker();

    const talkerId2 = talkerId.find(({ id }) => id === +req.params.id);

    if (!talkerId2) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    
    res.status(200).json(talkerId);
});

app.listen(PORT, () => {
  console.log('Online');
});
