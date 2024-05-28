// server.js
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51PIVHrJPAJMz2CjbNYkaw7juaTYY62O5vCfQgrlZyBFabDBo9FlnV79tohmaSlt8D64C8nwugLVz2ICevi91pHMv000Notbqod');

app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { plan } = req.body;

  const amount = plan === 'mensal' ? 1000 : 10000; // Exemplo de valores em centavos

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
