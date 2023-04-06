// 所有POST请求在此发送
import axios from 'axios'
import Qs from 'qs'
import router from '../router'
let token = "";

export function POST(url, params) {

  //返回异步请求结果
  return new Promise(function(resolve,reject){
    //发送请求并返回数据
    axios({
      url: url,
      method: 'post',
      data: Qs.stringify(params),
      //数据转换
      headers: {
        'token': token
      }

    }).then(function(res){
      //响应成功后设置token
      token = res.headers.token;

      //正常返回数据
      resolve(res.data);

    }).catch(error => {
      console.log("请求错误" + "-服务器响应码: "+error.response.status);
      if (error.response.status===403){
        console.log("403错误,请重新登录");
        router.push('/login/loginPage');
      }
      reject(error);
    });
  });

}

