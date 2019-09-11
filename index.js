// To use node modules(like fs to read files), we require them into our code and store the result in a variable.
const fs = require('fs');
// http gives us networking capability, such as building a server.
const http = require('http');
// for routing
const url = require('url');

// import modules
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////
// FILES

/*
// Blocking, synchronus way
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written!');
*/

/*
// Non-blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log('ERROR! :(');
    
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('Your file has been written :)');
            })
        });
    });
});
console.log('Will read file!');
*/

////////////////////////////////
// SERVER

// this part is executed once, when the app is executed. so sync is fine.
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// this is the part where the callback functons is called multiple times, everytime a user trys to access the server.
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    console.log(url.parse(req.url, true));

    // Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html',
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);        
        res.end(output);

    // API
    } else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data);

    // Not fount
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});


















