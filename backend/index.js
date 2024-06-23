require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const postCollection = client.db('database').collection('posts');
    const userCollection = client.db('database').collection('users');

    app.use(cors());
    // app.use(express.json());

    app.use('/webhook', bodyParser.raw({ type: 'application/json' }));

    app.use(express.json());

    // app.use(bodyParser.json());

    app.get('/', (req, res) => {
      res.send('Hello from Twitter!');
    });

    app.get('/post', async (req, res) => {
      const post = (await postCollection.find().toArray()).reverse();
      res.send(post);
    });

    app.get('/user', async (req, res) => {
      const user = await userCollection.find().toArray();
      res.send(user);
    });

    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email }).toArray();
      res.send(user);
    });

    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      const post = (await postCollection.find({ email }).toArray()).reverse();
      res.send(post);
    });

    app.post('/post', async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    app.post('/register', async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post('/create-checkout-session', async (req, res) => {
      const { priceId, email } = req.body;

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          customer_email: email,
          line_items: [{
            price: priceId,
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: `${process.env.FRONTEND_URL}/success`,
          cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.json({ id: session.id });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const email = session.customer_email;
    const subscriptionId = session.subscription;

    try {
      const result = await userCollection.updateOne(
        { email },
        { $set: { subscription: subscriptionId } },
        { upsert: true }
      );
      console.log('User subscription updated:', result);
    } catch (err) {
      console.error('Error updating user subscription:', err);
    }

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Define email options
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: session.customer_email,
          subject: 'Subscription Created',
          text: `Your subscription has been created successfully.\n\n
          Details:\n
          - Subscription ID: ${session.subscription}\n
          - Customer Email: ${session.customer_email}\n
          - Plan Price : ${session.amount_total/100}
          Thank you for subscribing to our service!`,
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }

      res.json({ received: true });
    });

    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = { email: req.params.email };
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Twitter backend listening on port ${port}`);
});