var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

var MovieSchema = new Schema({
    title: String,
    releaseYear: Number,
    genre: String,
    actors: {
        actor1: {
            name: String,
            role: String
        },
        actor2: {
            name: String,
            role: String
        },
        actor3: {
            name: String,
            role: String
        }
    }
});

module.exports = mongoose.model('Movie', MovieSchema);