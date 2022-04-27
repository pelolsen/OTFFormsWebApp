const axios = require('axios');

// Make a request for a user with a given ID
axios.get("https://api.mindbodyonline.com/public/v6/client/clients", {
    headers:{
        'Api-Key': "2af6763ede644dd6a5ac858400ea41d9",
        'SiteId': "-99",
        'Authorization': "a17e4cccfcfe4a3d92590b990ee5726ca794ab6d8cb74a34a85368c95ef772ff"
    }
}

)
  .then(function (response) {
      
      const listofnames =[]
      const allclients = response.data.Clients
      for(i=0; i<allclients.length; i++){
          listofnames.push(allclients[i].Email)
      }
      
    // handle success
    //console.log(response.data.Clients[0].Email);
    console.log(response.data.Clients[1].Email);
  })
  .catch(function (error) {
    // handle error
    //console.log(error);
  })
  .then(function () {
    // always executed
  });