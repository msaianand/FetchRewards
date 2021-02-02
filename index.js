const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment'); 
const app = express();
const port = 3000;
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let data = [];

app.get('/', (req, res) => {
    res.send('Hello Worlds, from points');
});
var dict = {};


function custom_sort(a, b) {
    return a.date - b.date;
}

app.post('/add', function(req, res) {
	let request = req.body;
let tmp = { 'playerName' : request.playerName, 'points' : request.points, 
'date' : moment(request.date,"MM/DD/YYYY h:mm a").toDate()};
data.push(tmp);
if(dict[request.playerName]){
    dict[request.playerName] += request.points;

}
else {
    dict[request.playerName] = request.points;
}
res.send('res sent'+JSON.stringify(dict));

});

app.post('/deduct', function(req, res) {
    let request = req.body;
    let resObj = [];
    if(request.deduct < 1){
        res.send('res sent'+JSON.stringify(resObj));
    }

    data.sort(custom_sort);

    let tmp = new Map();
    let val = 0;
    let index = -1;
  
    for(const i of data){ 
           val += i.points;
           index = index +1;
                if(tmp.has(i.playerName)){
                    tmp.set(i.playerName, tmp.get(i.playerName) + i.points);
                   console.log('tmp'+ tmp);
                }
                else{
                    tmp.set(i.playerName , i.points);
                }
            
           if(val >=  request.deduct)
            break;
    
    }

    if(index > 1)
         data.splice(0,index);

    let subVal = request.deduct;
   
    tmp.forEach((values,keys)=>{ 
       
        if(subVal >= values){
        resObj.push({ 'playerName' : keys, 'points' : -values, 
        'date' : new Date()});
        dict[keys] -= values;
        subVal -= values;
        }
        else{
            resObj.push({ 'playerName' : keys, 'points' : -subVal, 
        'date' : new Date()});
         data[0]['points'] =  values - subVal;
            dict[keys] -= subVal;
            subVal = 0;

        }
      }); 
    res.send('res sent'+JSON.stringify(resObj));
});

app.get('/balance', (req, res) => {
    res.send('bal'+ JSON.stringify(dict));
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))