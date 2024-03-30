const mongo = require('../config/database');
const data = require('./data.json');
const { User, Thought } = require('../model');

// Do nothing if the database errors
mongo.on('error', (err) => err);

// Initiate the connection
mongo.once('open', async () => {
    // Collections to be dropped
    const collections = [
        'users',
        'thoughts'
    ];
    // Drop the existing data
    for (const collection of collections) {
        if (await mongo.db.listCollections({name: collection }).toArray().length) {
            await mongo.db.dropCollection(collection);
        }
    }
    console.log("Document collections cleaned.");

    // Seed Users
    for (const email of data.user.emails) {
        // Apply a regex to extract first part of email as display name
        const displayName = (/^[^@]+/).exec(email)[0];
        // Create new user
        const result = await User.create({
            username: displayName,
            email: email
        });
        console.log("ADD User: ", result);
    }

    const users = await User.find({});

    // Seed Thoughts - Fixed to 10
    for (let x = 0; x <= 10; x++) {
        // Select random thought text and a user to assign
        const thoughtIndex = Math.floor( Math.random() * data.thought.posts.length );
        const userIndex = Math.floor( Math.random() * users.length );

        // Create new thoughts
        const result = await Thought.create({
            thoughtText: data.thought.posts[thoughtIndex],
            username: users[userIndex].username
        });
        console.log("ADD Thought: ", result);
    }

    // End process
    process.exit(0);
});