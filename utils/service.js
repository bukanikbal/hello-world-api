var {google} = require('googleapis')

var scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata"
]


module.exports = (clientId,clientSecret,redirectUri) => {
  return {
    authorize : (token) => {
      var client = new google.auth.OAuth2(
      	clientId,clientSecret,redirectUri
      )
      if(token){
        client.setCredentials(token)
      }
      return client
    },
    getAuthUrl : (client) => {
      return client.generateAuthUrl({
      	access_type:'offline',scope
      })
    },
    getAccessToken : (client,code) => {
      return new Promise((resolve,reject) => {
        client.getToken(code,(err,token) => {
          err ? reject(err) : resolve(token)
        })
      })
    },
    createDrive : (auth) => {
      return google.drive({
        version:'v3',auth
      })
    },
    upload : (drive,data) => {
      return new Promise((resolve,reject) => {
        drive.files.create(data,(err,file) => {
          err ? reject(err) : resolve(file)
        })
      })
    },
    permission : (drive,data) => {
      return new Promise((resolve,reject) => {
        drive.permissions.create(
          data,(error,response) => {
            error ? reject(error) 
            : resolve(response)
          }
        )
      })
    }
  }
}