module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      url: [
        "https://www.homent.co.za/",
        "https://www.homent.co.za/services",
        "https://www.homent.co.za/quote",
      ],
      settings: {
        maxWaitForLoad: 90000,
      },
    },
  },
};
