var ws=require('ws');

var wsc=new ws('ws://localhost:4000/ws');

wsc.on('open', () => {  
    var n=0;
    console.log('10-02-client: connected');
    messageInterval=setInterval(() => {
        wsc.send(++n);
    }, 3000);
    wsc.on('message', message => {
        console.log(`${message}`);
    });
    setTimeout(() => {
        clearInterval(messageInterval);
        wsc.close();
    }, 25000);
});

wsc.on('error', (err) => {
    console.log('Error: ', err);
});