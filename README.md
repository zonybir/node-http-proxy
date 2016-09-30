# Http proxy

##配置 config可设置拦截文件，适用于单页面应用，需要预编译开发，解决跨域问题，以及减少前期服务器配置依赖
```

{
	hostName:192.168.31.146,//ajax请求的服务器地址
	port:8017,//服务器端口
	root:'F://floruit/cxy-client/build',//寻找设置拦截文件的根目录
	local:['lib_bundle.js','entry.js','style.css','appStyle.css']//将要拦截的文件
}

```

##基于实际项目定制开发版本，后期慢慢优化，使其能适应更多场景.