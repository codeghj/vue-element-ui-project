import axios from 'axios'
export function request(url,data){
    return new Promise((resolve,reject)=>{
        const instance=axios.create({
            baseURL:'',
            timeout:5000

        })
        instance.post(url,data).then(res=>{
            resolve(res)
        })
    })
    
}