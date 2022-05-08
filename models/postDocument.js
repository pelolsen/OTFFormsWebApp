const axios = require('axios')
async function postDoc(data, auth){
    try {
        const res = await axios.post('https://api.mindbodyonline.com/public/v6/client/uploadclientdocument', data,{
            headers:{
                'Api-Key': "2af6763ede644dd6a5ac858400ea41d9",
                'SiteId': "-99",
                'Content-Type': "application/json",
                'Authorization': auth
            }
        })
        //console.log(`Status: ${res.status}`);
        //console.log('Body: ', res.data);
        console.log("DONE Uploaded");
        
    } catch (err) {
        console.log('shit fucked up');
    }
};
module.exports=postDoc;

const evtdata ={
    ClientId: "clientid",
    File: {
      FileName: "filename",
      MediaType: "application/pdf",
      Buffer: "Filen"
    }
}