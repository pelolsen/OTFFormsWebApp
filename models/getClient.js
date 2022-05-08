const axios = require('axios');
async function getClient(email, auth){
    try {
        console.log(email);
        const res = await axios.get(`https://api.mindbodyonline.com/public/v6/client/clients?SearchText=${email}`,{
            headers:{
                'Api-Key': "2af6763ede644dd6a5ac858400ea41d9",
                'SiteId': "-99",
                'Content-Type': "application/json",
                'Authorization': auth
            }
        })
        //console.log(`Status: ${res.status}`);
        //console.log('Body: ', res.data.Clients[0].FirstName);
        console.log(res.data);
        const ans = {
            check: "true",
            data: {
                id: res.data.Clients[0].Id,
                firstname: res.data.Clients[0].FirstName,
                lastname: res.data.Clients[0].LastName,
                gender: res.data.Clients[0].Gender,
                phone: res.data.Clients[0].HomePhone,
                birthday: res.data.Clients[0].BirthDate,
                email: res.data.Clients[0].Email
            }
        }
        console.log(ans);
        return ans
    } catch (err) {
        console.log(err);
        const ans = {
            check: "false",
            data: "there was an error"
        }
        return ans
    }
};

module.exports=getClient;
//TESTS:
//let yolo = 'paul@londontennis.co.uk'
//let yoli = '1064ea224d03421a9346cf9632749c726acc529040c244cf9bb11bc3b4c47b3a'
//console.log('what');
//getClient(yolo, yoli)
/*
async function test(){
  const dato = await getClient(yolo, yoli)  
  const data = dato.data

  for (const key in data){
      if(data[key]== null){
          data[key] = '';
      }
  }
  console.log(data);
}

test()
*/