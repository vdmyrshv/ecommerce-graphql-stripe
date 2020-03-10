'use strict';

const stripe = require("stripe")("sk_test_d2ZYxrxIJPrbdFU1ms78wgKi002PJerqn8");

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

    create: async (ctx) => {
        const { address, amount, brews, postalCode, token, city } = ctx.request.body;

        //send charge to stripe
        const charge = await stripe.charges.create({
            amount: amount*100,
            currency: "usd",
            description: `Order ${new Date(Date.now())} - User ${ctx.state.user._id}`,
            source: token
        });

        //create order in database
        const order = await strapi.api.orders.services.orders.create({
            user: ctx.state.user._id,
            address,
            amount,
            brews,
            postalCode,
            city
        })

        return order;

    }
};
