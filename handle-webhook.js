const respond = require("./send");
const Reader = require("./src/reader");
const Api = require("./src/gqlapi");
let searchString = '';
const getPhone = (data) => {
  if (data.contact !== null) {
    if (data.contact.company !== null) {
      if (data.contact.company.phones !== null) {
        return data.contact.company.phones[0]
      }
    }
    if (data.contact.phones !== null) {
      if (data.contact.person.phones !== null) {
        return data.contact.person.phones[0]
      }
    }
  }
}
const handleWebhook = async (req, res) => {
  try {
  const reader = new Reader();

  const chatbotMessage = reader.read(req)
  console.log(chatbotMessage)
    if (chatbotMessage.message === 'start') {
      searchString = '';
      respond(chatbotMessage.recipient, { 
        text: "Jakiego typu nieruchomości szukasz?",
        quick_replies:[
          {
            content_type: "text",
            title:"Dom",
            payload:"house",
          },{
            content_type: "text",
            title:"Mieszkanie",
            payload:"flat",
          }
        ]
      });
    }
    else if (
      chatbotMessage.message === 'house' ||
      chatbotMessage.message === 'flat'
    ) { 
      respond(chatbotMessage.recipient, { 
        text: "Jakiego rodzaj transakcji Cię interesuje?",
        quick_replies:[
          {
            content_type: "text",
            title:"Kupno",
            payload:`${ chatbotMessage.message }.sale`,
          },{
            content_type: "text",
            title:"Wynajem",
            payload:`${ chatbotMessage.message }.rent`,
          }
        ]
      });
    } else if (
      chatbotMessage.message === 'house.rent' ||
      chatbotMessage.message === 'house.sale' ||
      chatbotMessage.message === 'flat.rent' ||
      chatbotMessage.message === 'flat.sale'
    ) {
      searchString = chatbotMessage.message;
      respond(chatbotMessage.recipient, { 
        text: "Podaj preferowaną lokalizację? Wpisz: szukaj:<nazwa lokalizacja>",
      });
    } else if (chatbotMessage.message.includes('szukaj:')) {
      const searchParams = searchString.split('.');
      const searchLocation = chatbotMessage.message.replace('szukaj:', '');
      const searchType = searchParams[0];
      const searchTansaction = searchParams[1];
      const api = new Api();
      console.log(searchLocation)
      const response = await api.getProperties(searchLocation, searchType.toUpperCase(), searchTansaction.toUpperCase())
      const propertiesList = response.searchProperties.nodes;
      const propertiesListGenerics = propertiesList.map(element => {
        return {
          "title": element.locationShort[0].toUpperCase() || 'test',
          "image_url": element.photo || 'https://img3.staticmorizon.com.pl/thumbnail/aHR0cDovL21lZGlhLm1vcml6b24ucGwvaW1nL2Rld2Vsb3Blcnp5Lzc0MjRfd2l6dWFsaXphY2phMS5qcGc=/832/468/2/mieszkanie-w-inwestycji-variant-praga-warszawa-66-m-morizon.jpg',
          "subtitle":`Cena: ${element.price.amount} zł`,
          "default_action": {
            "type": "web_url",
            "url": `https://www.morizon.pl/oferta/sprzedaz-mieszkanie-warszawa-wilanow-franciszka-klimczaka-64m2-mzn-${element.id}`,
            "webview_height_ratio": "tall",
          },
          "buttons":[
            {
              "type":"web_url",
              "url":`https://www.morizon.pl/oferta/sprzedaz-mieszkanie-warszawa-wilanow-franciszka-klimczaka-64m2-mzn-${element.id}`,
              "title":"Przejdź do ogłoszenia"
            }, {
              "type":"phone_number",
              "title":"Zadzwoń",
              "payload":`+48 ${getPhone(element) || '72312123'}`
            }         
          ]      
        }
      })
      respond(chatbotMessage.recipient, { 
        // text: response.searchProperties.nodes.length,
        attachment:{
          "type":"template",
          "payload":{
            "template_type":"generic",
            "elements": propertiesListGenerics
          }
        }
      });
    }
  } catch (e) {
    console.log(e)
  }
  res.sendStatus(200);
};

module.exports = handleWebhook;


// const Reader = require("./src/reader");
// const Responser = require("./src/responser")
// const Messenger = require('messenger-node');

// const handleWebhook = (request, res) => {
//   let clientConfig = {
//     'page_token': 'EAAkTLSSPSPYBAEXChxA8Q33HstkiwJ7PcX15XDXvSwZAmqOdsUZBduuqc0haPdvovOR9yfNbtm4VMD1yYMgrfSmgUtoVjZBUXxJCIwjEVwg6h1P44v6bQELAd5mWLwKriOpL8PgCWDYOyUZCBJTZAEJbm0R6ZBZAZBlZAwYCESKofEQZDZD',
//   }
  


//   if (chatbotMessage.message) {
//     client.sendText(chatbotMessage.recipient, 'dupa')
//     .then(res => {
//       console.log(res);
//     })
//     .catch(e => {
//       console.error(e);
//     });
//   }
// };

// module.exports = handleWebhook;
