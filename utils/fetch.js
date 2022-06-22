import axios from 'axios'

export default function(url){
  return function(method,path,data){
  	return new Promise((resolve,reject) => {
      axios({method,url: `${url}/${path}`,data})
      .then(({data}) => resolve(data)).catch(({response}) => {
        reject({status: response.status,message: response.data})
      })
  	})
  }
}