const mongoose = require('mongoose');

(async () => {
  try {
    // connect to database
    const dbUri = `mongodb://localhost:27017/festify-ws`;
    await mongoose.connect(dbUri);

    console.log('Connected to MongoDB');

    // Seed data here
    // ...
    const collection = 'besemaildeliverystats';
    await mongoose.connection.db.dropCollection(collection);
    await mongoose.connection.db.createCollection(collection);

    const ONE_HOUR_IN_MS = 1000 * 60 * 60;
    const startTimestamp =
      Math.floor(Date.now() / ONE_HOUR_IN_MS) * ONE_HOUR_IN_MS;

    const data = [];
    for (let i = 0; i < 2000; i++) {
      const skip = Math.random() < 0.1;
      if (skip) continue;

      const sent = Math.floor(Math.random() * 1000);
      const delivered = Math.floor(Math.random() * sent);
      const errored = sent - delivered;
      data.push({
        account: '670ad13811bf01c240b91cd6',
        instance: '6724bc1aa9b15b4d06e44212',
        sent,
        delivered,
        errored,
        hour: new Date(startTimestamp - i * ONE_HOUR_IN_MS),
      });
    }

    await mongoose.connection.collection(collection).insertMany(data);
    console.log('Data seeded successfully');

    // close the connection
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
})();
