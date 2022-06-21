 // req 4
 const validaEmail = (req, res, next) => {
     const { email } = req.body;

     if (!email) {
        return res.status(400).json({ message: 'O campo "email" é obrigatório' });
       } 
     
       const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
       if (!emailRegex.test(email)) {
           res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
       }
next();
 };
 module.exports = validaEmail;