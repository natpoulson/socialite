const mongo = require('../config/database');
const data = require('./data.json');
const { User, Thought } = require('../model');

// Do nothing if the database errors
mongo.on('error', (err) => err);

// Initiate the connection
mongo.once('open', async () => {
    const collections = await mongo.listCollections();
    for (const collection of collections) {
        await mongo.dropCollection(collection.name);
    }

    console.log("Document collections purged.");
    console.log("Seeding users...");
    // Seed Users
    for (const email of data.user.emails) {
        // Apply a regex to extract first part of email as display name
        const displayName = (/^[^@]+/).exec(email)[0];
        // Create new user
        const result = await User.create({
            username: displayName,
            email: email
        });
        console.log(`ADD USER: ${result.username} (${result._id})`);
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
        console.log(`ADD Thought: ${result.username} (${result._id})\n${result.thoughtText}`);

        // Attach the thought to a user
        const userAddResult = await User.findOneAndUpdate(
            {_id: users[userIndex]._id},
            {
                $addToSet: {
                    thoughts: { _id: result._id }
                }
            },
            { new: true }
        );
        console.log(`ATTACH Thought`, userAddResult);
    }

    const thoughts = await Thought.find({});

    // Create random reactions
    for (let x = 0; x <= 5; x++) {
        const targetThought = thoughts[Math.floor( Math.random() * thoughts.length )];
        const reactBodyIndex = Math.floor( Math.random() * data.reaction.bodies.length );
        const reactUserIndex = Math.floor( Math.random() * users.length );

        const result = await Thought.findOneAndUpdate(
            {_id: targetThought._id},
            { 
                $addToSet: {
                    reactions: {
                        reactionBody: data.reaction.bodies[reactBodyIndex],
                        username: users[reactUserIndex].username
                    }
                }
            },
            { new: true }
        );
        console.log("ADD Reaction: ", result);
    }

    // End process
    process.exit(0);
});