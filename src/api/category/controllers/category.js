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
        const contentType = strapi.contentType("api::category.category");
        const { category, offset, limit } = ctx.query;

        const limitFilter = limit === undefined ? 4 : parseInt(limit);
        const startFilter = offset === undefined ? 0 : parseInt(offset);

        if (category === undefined) {
          const categories = await strapi.entityService.findMany(
            "api::category.category",
            {
              sort: "id",
              start: startFilter,
              limit: limitFilter,
            }
          );
          const sanitizedEntity = await sanitize.contentAPI.output(
            categories,
            contentType
          );
          return sanitizedEntity;
        }

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
          ctx.body = "Not found. category: " + category;
          ctx.status = 404;
          return;
        }

        filters = {
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

        const sanitizedEntity = await sanitize.contentAPI.output(
          reviews,
          contentType
        );
        return sanitizedEntity;
      } catch (error) {
        console.error(error);
        ctx.body = error.message;
        ctx.status = 400;
      }
    },
  })
);
