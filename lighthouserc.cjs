module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        "https://www.hestiva.co.za/",
        "https://www.hestiva.co.za/services",
        "https://www.hestiva.co.za/quote",
      ],
      settings: {
        maxWaitForLoad: 90000,
      },
    },
  },
};
