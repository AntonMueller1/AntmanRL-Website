import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const app = express();
const port = process.env.PORT || 4242;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const planCatalog = {
  'hour-session': {
    name: 'AntmanRL Hour Session',
    description: 'One-time 1-on-1 Rocket League coaching session.',
    unitAmount: 3000,
  },
  'replay-review': {
    name: 'AntmanRL Replay Review',
    description: 'One-time Rocket League replay review.',
    unitAmount: 800,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({
      error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env file.',
    });
  }

  const selectedPlan = planCatalog[req.body?.plan];

  if (!selectedPlan) {
    return res.status(400).json({ error: 'Invalid plan selected.' });
  }

  try {
    const origin =
      req.headers.origin ||
      `${req.protocol}://${req.get('host')}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description,
            },
            unit_amount: selectedPlan.unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#services`,
      cancel_url: `${origin}/?checkout=cancel#services`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    return res.status(500).json({
      error: error.message || 'Unable to create checkout session.',
    });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Stripe server running on http://localhost:${port}`);
});
