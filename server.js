const express = require("express");
const app = express();
var cors = require('cors')
const env = require("dotenv").config({ path: "./.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/create-contribution", async (req, res) => {
  try {
    const amount = req.query.amount * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: amount,
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(4000, () =>
  console.log(`Server listening at http://localhost:4000`)
);
