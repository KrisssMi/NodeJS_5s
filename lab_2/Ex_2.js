var http=require('http');
var fs=require('fs');

http.createServer(function(request, response)
{
    const fname='./puppy.jpg';
    let jpg=null;                             

    fs.stat(fname,(err, stat)=>{                
        if (err){
            console.log('error:', err);
        }
        else {
            jpg=fs.readFileSync(fname);        
            response.writeHead(200, {'Content-Type': 'image/jpeg', 'Contemt-Length':stat.size}); 
            response.end(jpg, 'binary');       
        }
    })
}).listen(3000,console.log('http://localhost:3000/html'));

