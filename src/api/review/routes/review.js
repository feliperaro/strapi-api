module.exports = {
    routes: [
      {
        method: "POST",
        path: "/review",
        handler: "review.index",
        "content-type": "application/json",
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  