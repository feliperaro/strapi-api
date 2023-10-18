// @ts-nocheck
"use strict";

/**
 * category controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const { sanitize } = require("@strapi/utils");

module.exports = createCoreController(
  "api::category.category",
  ({ strapi }) => ({
    async find(ctx) {
      try {
        const { category, offset, limit } = ctx.query;

        const startFilter = offset === undefined ? 0 : parseInt(offset);
        const limitFilter = limit === undefined ? 4 : parseInt(limit);

        let filters = {
          filters: {
            name: {
              $eq: category,
            },
          },
        };

        const [categoryService] = await strapi.entityService.findMany(
          "api::category.category",
          filters
        );

        if (!categoryService) {
          ctx.response.status = 404;
          ctx.response.message = "Not found. category: " + category;
          return;
        }

        filters = {
          fields: ["title"],
          filters: {
            categories: [categoryService.id],
          },
          sort: "id",
          start: startFilter,
          limit: limitFilter,
        };

        const reviews = await strapi.entityService.findMany(
          "api::review.review",
          filters
        );

        const contentType = strapi.contentType("api::category.category");
        const sanitizedEntity = await sanitize.contentAPI.output(
          reviews,
          contentType
        );
        return sanitizedEntity;
      } catch (error) {
        console.log(error);
        ctx.error = error;
      }
    },
  })
);
