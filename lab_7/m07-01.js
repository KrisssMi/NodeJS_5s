const fs = require('fs');   

function Stat(sfn = './static') {   
    this.STATIC_FOLDER = sfn; 
    let pathStatic = (fn) => `${this.STATIC_FOLDER}${fn}`;

    this.writeHTTP404 = (response) => {
        response.statusCode = 404;
        response.statusMessage = 'Resource not found';
        response.end("HTTP ERROR 404: Resource not found");
    };

    let pipeFile = (request, response, headers) => {
        response.writeHead(200, headers);
        fs.createReadStream(pathStatic(request.url)).pipe(response);    // формирование ответа из файла с помощью потоков чтения и записи 
    };

    this.isStatic = (ext, fn) => {                                      
        let reg = new RegExp(`^\/.+\.${ext}$`);
        return reg.test(fn);                                            
    };

    this.sendFile = (request, response, headers) => {                   
        fs.access(pathStatic(request.url), fs.constants.R_OK, err => {  
            err ? this.writeHTTP404(res) : pipeFile(request, response, headers); 
        });
    }
}

module.exports = (parm) => new Stat(parm);                              