/**
 * Created by dy on 8/10/2016.
 */

var todolist = ["task 1", "task 2", "task 3"];
var PORT_NUM = 8000;
var http = require('http');
var url = require('url');

var server = http.createServer(function(request, response){
    //Set header for content type and CORS
    response.setHeader('Content-Type', 'application/json; charset="utf-8"');
    response.setHeader('Access-Control-Allow-Origin', '*');
    //log the request method
    console.log(request.method);
    switch(request.method) {
        case 'GET':
            //Read list elements from server
            var listString = '{' + todolist.map(function (content, i){
                return '\"'+ i +'\":' + '\"' + content +'\"';
            });
            listString = listString + '}';
            response.setHeader('Content-Length', Buffer.byteLength(listString));
            response.end(listString);
            break;
        case 'POST':
            //Update list element in server
            var item = '';
            request.on('data', function (chunk) {
                item += chunk;
                if (item.length > 1e6)
                    //Too much POST data, end connection
                    request.connection.destroy();
            });
            request.on('end', function(){
                todolist.push(item);
                response.end();
            });
            break;
        case 'DELETE':
            //Delete list element in server
            var index = url.parse(request.url).pathname.substring(1);
            console.log(index);
            if(isNaN(index)){
                response.statusCode=400;
                response.end('Error: index not a number.');
            }
            else {
                todolist.splice(index, 1);
                response.end();
            }
            break;
        case 'PUT':
            //Update list element in server
            var item = '';
            request.on('data', function (chunk) {
                item += chunk;
                if (item.length > 1e6)
                //Too much POST data, end connection
                    request.connection.destroy();
            });
            request.on('end', function(){
                var index = url.parse(request.url).pathname.substring(1);
                if(isNaN(index)){
                    response.statusCode=400;
                    response.end('Error: index not a number.');
                }
                else {
                    todolist[index] = item;
                    response.end();
                }
            });
            break;
        case 'OPTIONS':
            //CORS preflight, allow all methods listed above
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
            response.end();
            break;
    }
});

server.listen(PORT_NUM);
console.log("Server up at port "+PORT_NUM);