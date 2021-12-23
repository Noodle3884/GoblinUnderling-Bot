import { ChatUser } from '@twurple/chat/lib';
import tmi from 'tmi.js'
import { BLOCKED_WORDS, BOT_USERNAME, CHANNEL_NAME, OAUTH_TOKEN } from './constants';

const options = {
    options: { debug: true },
    connection: {
        reconnect: true,
        secure: true,
        timeout: 180000,
        reconnectDecay: 1.4,
        reconnectInterval: 1000,
        },
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
}

const client = new tmi.Client(options);

client.connect();


// use of !hello and what the bot messages back
client.on('message', (channel, userstate, message, self) => {
	// Ignore echoed messages.
	if(self) return;
    if (userstate.username === BOT_USERNAME) {
        console.log(`Not checking bot's messages.`)
        return
      }

    checkTwitchChat (userstate, message, channel)


    // Event handliers
    // saves the string after the command to be used later in a function
    var messageSplitter = message.split(" ");
    messageSplitter.shift();
    messageSplitter = messageSplitter.join(" ").toString();


    if(message.toLowerCase().startsWith('!hello')) {
        hello(channel, userstate, messageSplitter)
    }

    if(message.toLowerCase() === '!discord') {
        discord(channel, userstate)
    }

    if(message.toLowerCase() === '!dice') {
        dice(channel, userstate)
    }

   /* if(message.toLowerCase().startsWith('!marker')) {
        marker(channel, userstate, messageSplitter)
    }*/

    if(message.toLowerCase() === '!github') {
        gitHub(channel, userstate)
    }

});


// commands
function checkTwitchChat(userstate, message, channel) {
    console.log(message)
    console.log(userstate.broadcaster)
    message = message.toLowerCase()
    let shouldSendMessage = false
    shouldSendMessage = BLOCKED_WORDS.some(blockedWord => message.includes(blockedWord.toLowerCase()))
    if (shouldSendMessage) {
      // tell user
      client.say(channel, `@${userstate.username}, sorry!  Your message was deleted.`)
      // delete message
      client.deletemessage(channel, userstate.id)
    }
}
    function hello (channel, userstate, messageSplitter) {
        console.log(messageSplitter)
        if(userstate.mod == true) {
        client.say(channel, `@${userstate.username}, heyyyyy!`);
        } else {
            client.say(channel, `@${userstate.username}, heya!`)  
    }   
}

     //Unless the person typing has editor need to work on later
   /* function marker (channel, userstate, messageSplitter) {
        console.log(userstate.broadcaster)
        console.log(messageSplitter)
        // sets a marker in the livestream for the stream only mods can use this
        if(userstate.mod == true) {
            console.log("success")
            client.say(channel, `/marker ` + messageSplitter)
        } else {
            console.log("failure")
            client.say(channel, `@${userstate.username}, sorry you don't have permission to use that command`)
        }
    }*/

    function gitHub(channel, userstate) {
        client.say(channel, `@${userstate.username}, check out the creator's github here https://github.com/Noodle3884`)
    }

    function discord (channel, userstate) {
    // "@alca, check out the discord! (discord link)"
    client.say(channel, `@${userstate.username}, Join the discord `)
}

    function dice (channel, userstate) {
        // "@alca, hey you rolled a #"
        var min = 1;
        var max = 6;
        var roll = Math.floor(Math.random() * (max - min + 1) + min);
        client.say(channel, `@${userstate.username}, you rolled a ` + roll)

    }
