const API_URL = "https://mzn-sites-api.melog.com";
const { GraphQLClient } = require("graphql-request");
const client = new GraphQLClient(API_URL);
const Api = require("./src/gqlapi");

const api = async (req, res) => {
  console.log('test')
  const api = new Api();
  const data = await api.getProperties('warszawa', 'FLAT', 'SALE')
  res.json(data);
};

module.exports = api;
