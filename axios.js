/*
沐小白2018，封装请求处理函数
 */
import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'


const cancel,promiseArr =  {}
const CancelToken = axios.CancelToken;

// 请求 拦截过滤器
axios.interceptors.request.use( config => {
	if(promiseArr[config.url]) {//发起请求时，取消掉当前进行的相同请求
		promiseArr[config.url]('操作取消')
		promiseArr[config.url] = cancel
	}else{
		promiseArr[config.url] = cancel
	}
	return config
},error => {
	return Promise.reject(error)
})

// 响应 拦截过滤器
axios.interceptors.response.use( response => {
	//获取token并把token放在缓存里面
	let tokens = response.data //获取携带token的数据
	if(tokens.hasOwnProperty("token")) { //判断tokens属性里面是否有token
		sessionStorage.setItem('token',tokens.token) //将token存入本地缓存
		axios.defaults.headers.token = sessionStorage.getItem('token') //头部添加token响应头
	}
	return response
}， err => {
	//请求错误判断，根据不同的错误提示不同消息
	if(err && err.response) {
		switch (err.response.status) {
			case 400：
				message.error('错误请求', 3)
				break;
			case 401:
				message.error('未授权，请重新登录'，2.5, () => (this.history.push('/login')))
				break；
			case 403:
				message.error('拒绝访问，请重新登陆'，2.5，() => (this.history.push('/login')) )	
				break;
			case 404:
				message.error('请求错误,未找到该资源'，2.5，() => (this.history.push('/')) )	
				break;
			case 405:
				message.error('请求方法未允许'，2.5，() => (this.history.push('/')) )	
				break;
			case 408:
				message.error('请求超时'，2.5)	
				break;
			case 500:
				message.error('服务器端出错'，2.5)	
				break;
			case 501:
				message.error('网络未实现'，2.5)	
				break;
			case 502:
				message.error('网络错误'，2.5)	
				break;
			case 503:
				message.error('服务不可用'，2.5)	
				break;
			case 504:
				message.error('网络超时'，2.5)	
				break;
			case 505:
				message.error('http版本不支持该请求'，2.5)	
				break;
			default:
				message.error(`连接错误${err.response.status}`，2.5)
		}
	} else {
		message.error('连接到服务器失败')
	}
	return Promise.resolve(err.response)
})

//设置默认 API请求地址
axios.defaults.baseURL = url;

//设置默认请求头
axios.defaults.headers = {
	'content-type' : 'application/json',  //传出类型 ）json,form表单
	'token' : sessionStorage.getItem('token') //token
}

// 输出请求方式
export default {
	//get请求
	get ( url, param ) {
		return new Promise( (resolve, reject ) =>{
			axios({
				method: 'get',
				url: url,
				params: qs.stringify( param ),
				CancelToken: new CancelToken( c => {
					cancel = c
				})
			}).then( res => {
				resolve(res)
			})
		})
	},
	//post请求
	post ( url, param ) {
		return new Promise( (resolve, reject ) =>{
			axios({
				method: 'get',
				url: url,
				params: qs.stringify( param ),
				CancelToken: new CancelToken( c => {
					cancel = c
				})
			}).then( res => {
				resolve(res)
			})
		})
	}
}
