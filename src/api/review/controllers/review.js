"use strict";

/**
 * review controller
 */
const { sanitize } = require("@strapi/utils");

module.exports = {
  index: async (ctx) => {
    const { title, rating, body, categories, publisher } = ctx.request.body;
    console.log(title, body, rating, publisher);

    const [publisherService] = await strapi.entityService.findMany(
      "api::publisher.publisher",
      {
        filters: { name: { $eq: publisher } },
      }
    );
    publisherService.lastReviewed = new Date();
    await strapi.entityService.update(
      "api::publisher.publisher",
      publisherService.id,
      {
        data: publisherService,
      }
    );

    const entity = await strapi.entityService.create("api::review.review", {
      data: { title, rating, body, categories, publisher: publisherService.id },
    });

    const contentType = strapi.contentType("api::review.review");
    const sanitizedEntity = await sanitize.contentAPI.output(
      entity,
      contentType
    );
    return sanitizedEntity;
  },
};
