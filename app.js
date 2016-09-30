const http = require('http'),
	  path = require('path'),
	  fs = require('fs'),
	  config=require('./config'),
	  mime=require('./mine');

const server = http.createServer((req,res)=>{
	var url=req.url,
		method=req.method;

	//拦截首页index
	if(url=='/'){
		fs.readFile(config.root+url+'index.html',(err,file)=>{
	        if (err) {
	            res.writeHead(500, {'Content-Type': 'text/plain'});
	            res.end(err);
	        } else {
	            res.writeHead(200, {'Content-Type': content_type});
	            res.end(file);
	        };
	    });
	}else{
	//匹配拦截文件
	var file_name=path.basename(url),
		file_ext=path.extname(url).slice(1) || 'unknown',
		content_type=mime[file_ext];

	for(var i=0,len=config.local.length;i<len;i++){
		if(config.local[i]==file_name){
			console.log(file_name);
			fs.exists(config.root+url,(rs)=>{
				if(rs){
				    fs.readFile(config.root+url,(err,file)=>{
				        if(err){
				            res.writeHead(500, {'Content-Type': 'text/plain'});
				            res.end(err);
				        }else {
				            res.writeHead(200, {'Content-Type': content_type});
				            res.end(file);
				        };
				    });
				}else{
				    res.writeHead(404, {'Content-Type': 'text/plain'});
				    res.end();
				}
			})
			return;
		}
	}

	//其他请求
	var options = {
		hostname: config.hostName,
		port: config.port,
		path: url,
		method: method,
		headers:req.headers
	};
	const request=http.request(options,(server_res)=>{
		var data=[],size=0;
		server_res.on('data', function(chunk) {
		    data.push(chunk);
		    size+=chunk.length;
		}).on('end',function(){
		    var req_data=Buffer.concat(data,size);//连接转发数据
		    res.writeHead(server_res.statusCode,server_res.headers);//转发服务器headers
		    res.end(req_data);//发送服务器来的数据
		});
	});
	request.on('error',(error)=>{
		res.writeHead(500,{'Content-Type':"text/plain"});
		request.end("error other error");
	})
	//post 请求时  获取post数据并转发给服务器
	var body='';
	if(req.method=='POST'){
	    req.on('data',function (data) {//获取客服端post数据
	        body+=data;
	    }).on('end',function () {
	        request.write(body);
	        request.end();
	    });
	}else{
	    request.end();
	}

	}
})

server.listen(7481,()=>{
	console.log('server start');
})

server.on('error',(error)=>{
	console.log(error);
})
