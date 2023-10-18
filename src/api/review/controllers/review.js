// @ts-nocheck
"use strict";

const { sanitize } = require("@strapi/utils");

module.exports = {
  index: async (ctx) => {
    try {
      const contentType = strapi.contentType("api::review.review");
      const { title, rating, body, categories, publisher } = ctx.request.body;

      const [publisherService] = await strapi.entityService.findMany(
        "api::publisher.publisher",
        {
          filters: { name: { $eq: publisher } },
        }
      );

      if (!publisherService) {
        ctx.body = "Publisher not found. publisher: " + publisher;
        ctx.status = 404;
        return;
      }

      publisherService.lastReviewed = new Date();

      await strapi.entityService.update(
        "api::publisher.publisher",
        publisherService.id,
        {
          data: publisherService,
        }
      );

      let categoriesService = [];
      for (const category in categories) {
        const categoryName = categories[category];
        const [categoryService] = await strapi.entityService.findMany(
          "api::category.category",
          {
            filters: { name: { $eq: categoryName } },
          }
        );

        if (!categoryService) {
          ctx.body = "category not found. category: " + categoryName;
          ctx.status = 404;
          return;
        }

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

      const sanitizedEntity = await sanitize.contentAPI.output(
        entity,
        contentType
      );
      return sanitizedEntity;
    } catch (error) {
      console.error(error);
      ctx.body = error.message;
      ctx.status = 400;
    }
  },
};
