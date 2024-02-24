const express = require('express');
const app = express();
const port = 5500;
require('dotenv').config();
const apiKey = process.env.API;

app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    try {
        const data = await getRawData();

const getApiDate = (index) => {
const apiDate = new Date(data.data[index].published_at);

const currentTime = new Date();
const timeDifference = currentTime - apiDate;

const secondsDifference = Math.floor(timeDifference / 1000);

const secondsInMinute = 60;
const secondsInHour = 3600;
const secondsInDay = 86400;

const days = Math.floor(secondsDifference / secondsInDay);
const hours = Math.floor((secondsDifference % secondsInDay) / secondsInHour);
const minutes = Math.floor((secondsDifference % secondsInHour) / secondsInMinute);

let timeAgo = "";
if (days > 0) {
  timeAgo += days + "d ";
}
if (hours > 0) {
  timeAgo += hours + "h ";
}
if (minutes > 0) {
  timeAgo += minutes + "m";
}

return timeAgo
}
        res.render('index', {
            cat: [data.data[0].categories[0], data.data[1].categories[0], data.data[2].categories[0],], 
            items: [data.data[0].title, data.data[1].title, data.data[2].title,],
            snip: [data.data[0].snippet, data.data[1].snippet, data.data[2].snippet,],
            img: [data.data[0].image_url, data.data[1].image_url, data.data[2].image_url,],
            published: [getApiDate(0), getApiDate(1), getApiDate(2),], 
            source: [data.data[0].url, data.data[1].url, data.data[2].url,],
        });
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).send('Internal Server Error');
    } 
});

async function getRawData() {
    try {
        const response = await fetch(`https://api.thenewsapi.com/v1/news/top?locale=us&language=en&api_token=${apiKey}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok. Status: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data[0])
        return data
    } catch (error) {
        console.error('Error: ', error);
        throw error
    }

}

const userRouter = require('./routes/category')

app.use('/category', userRouter);


app.use(express.static(__dirname + '/public'));


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});