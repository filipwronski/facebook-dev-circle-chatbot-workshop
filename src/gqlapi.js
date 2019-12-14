const API_URL = "https://mzn-sites-api.melog.com";
const { GraphQLClient } = require("graphql-request");
const client = new GraphQLClient(API_URL);

const Api = class Api {
  async getProperties (location, type, transaction) {
    const query = `
      query searchProperties($locations: [String!], $type: [PropertyType!], $transaction: PropertyTransaction) {
          searchProperties (
            searchFilters: {
              locations: $locations
              type: $type
              transaction: $transaction
            }
            numberOfResults: 10
          ) {
            nodes {
              id,
              contact {
                person {
                  phones
                }
                company {
                  phones
                }
              }
              photo(configuration: CROP_618X280),
              locationShort,
              price {
                amount
                currency
              }
            }
          }
        }
      `;
    let data;
    try {
      data = await client.request(query, {
        locations: [location],
        type,
        transaction
      });
    }
    catch(e) {
      console.log(e);
    }
    return data;
  }
}

module.exports = Api;