const request = require('request')
const TelegramBot = require('node-telegram-bot-api')
const token = '6510373115:AAGC-rBSkqyKnlUd05_xoKPsdgGKbBZ_ZXg'
const bot = new TelegramBot(token, {polling: true})

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var serviceAccount = require("./database.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(); 

bot.on('message', function(msg){
    console.log(msg);
    const request = require('request')
    if (msg.text === '/start') {
        bot.sendMessage(msg.chat.id, 'Hello 😄! Welcome to this channe l.')
        bot.sendMessage(msg.chat.id, 'Enter Your Anime Name')
        return;
      }
    var k = msg.text.toLowerCase()
    if (k === "history"){
        //for getting the data from collection
        db.collection("anime").where("chatid", "==", msg.chat.id).get().then(function(docs){
            docs.forEach((doc) => {
                console.log(doc.id, '=>', doc.data());
                bot.sendMessage(msg.chat.id,"Name: "+doc.data().name);  
                bot.sendMessage(msg.chat.id, "Rating: "+doc.data().rating);  
                bot.sendMessage(msg.chat.id,"Episodes: "+doc.data().episodes);  
                bot.sendMessage(msg.chat.id,"Duration: "+doc.data().duration);
                bot.sendMessage(msg.chat.id,"Image: "+doc.data().image);  
                bot.sendMessage(msg.chat.id,"Online Streaming: "+doc.data().url);    
           });
        }).catch(function(error) {
            // Handle the error if there's any
            console.error("Error getting documents: ", error);
        });
        return;
    }
    if (!isValidInput(msg.text)) {
        bot.sendMessage(msg.chat.id, 'Please,  Enter The Name Correctly ')
        return;
    }
    request('https://api.jikan.moe/v4/anime?q='+msg.text+'&sfw', function (error, response, body) {
        if(!JSON.parse(body).data[0]){
            bot.sendMessage(msg.chat.id, 'Sorry😕 Anime cannot be found')
            return ;
        }
        bot.sendMessage(msg.chat.id, 'Name: '+msg.text.toUpperCase())
        bot.sendMessage(msg.chat.id, 'Rating: '+JSON.parse(body).data[0].rating)
        bot.sendMessage(msg.chat.id, "IMAGE: "+JSON.parse(body).data[0].images.jpg.large_image_url)
        bot.sendMessage(msg.chat.id, 'Episodes: '+JSON.parse(body).data[0].episodes)
        bot.sendMessage(msg.chat.id, 'Duration: '+JSON.parse(body).data[0].duration)
        bot.sendMessage(msg.chat.id, 'Online Streaming:  '+'https://animedex.live/search?query='+encodeURIComponent(msg.text))
        //Adding new data to collection
        db.collection('anime').add({
            chatid:msg.chat.id,
            name:msg.text.toUpperCase(),
            rating:JSON.parse(body).data[0].rating,
            episodes:JSON.parse(body).data[0].episodes,
            duration:JSON.parse(body).data[0].duration,
            image:JSON.parse(body).data[0].images.jpg.large_image_url,
            url:"https://animedex.live/search?query="+encodeURIComponent(msg.text)
        })
        
        
    })

})
function isValidInput(text) {
    const validPattern = /^[A-Za-z\s]+$/
    return validPattern.test(text)
}  



                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      