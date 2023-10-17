// @ts-nocheck
"use strict";

const { sanitize } = require("@strapi/utils");

module.exports = {
  index: async (ctx) => {
    const { title, rating, body, categories, publisher } = ctx.request.body;
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

    const categoriesService = [];
    for (const category in categories) {
      const categoryName = categories[category];
      const [categoryService] = await strapi.entityService.findMany(
        "api::category.category",
        {
          filters: { name: { $eq: categoryName } },
        }
      );
      categoriesService.push(categoryService.id);
    }

    const entity = await strapi.entityService.create("api::review.review", {
      data: {
        title,
        rating,
        body,
        categories: categoriesService,
        publisher: publisherService.id,
      },
    });

    const contentType = strapi.contentType("api::review.review");
    const sanitizedEntity = await sanitize.contentAPI.output(
      entity,
      contentType
    );
    return sanitizedEntity;
  },
};
