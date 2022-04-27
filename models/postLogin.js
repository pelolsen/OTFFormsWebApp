const axios = require('axios');
/*
axios.post('https://api.mindbodyonline.com/public/v6/usertoken/issue', data,{
    headers:{
        'Api-Key': "2af6763ede644dd6a5ac858400ea41d9",
        'SiteId': "-99",
        'Content-Type': "application/json"
    }
})
    .then((res,err) => {
        console.log(res.data)
        
        //Uconsole.log(`Status: ${res.status}`);
        //console.log(res.data);
    }).catch((err) => {
        console.log("FUCK");
    });
*/
async function authkeycheck(data){
    try {
        const res = await axios.post('https://api.mindbodyonline.com/public/v6/usertoken/issue', data,{
            headers:{
                'Api-Key': "2af6763ede644dd6a5ac858400ea41d9",
                'SiteId': "-99",
                'Content-Type': "application/json"
            }
        })
        //console.log(`Status: ${res.status}`);
        //console.log('Body: ', res.data);
        const ans = {
            check: "true",
            data: res.data
        }
        return ans
    } catch (err) {
        const ans = {
            check: "false",
            data: "nodata"
        }
        return ans
    }
};
const bro = {
    Username: "Siteowner",
    Password: "apitest1234"
};

//console.log(authkeycheck(bro));

module.exports = authkeycheck