const mongoose = require('mongoose')
require('dotenv').config()
const Person = require('./models/person')
const db_password = process.env.DB_PASSWORD


const url = process.env.DB_HOST
mongoose.set("strictQuery", false)
mongoose.connect(url)

const Person = mongoose.model("Person", personSchema)

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
if (db_password !== process.argv[2]) {
    console.log("Passwords do not match, please enter the correct password")
    process.exit(1)
}
if (process.argv.length == 3) {
    console.log("Fetching all persons..\n")
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
    }).finally(() => {
        mongoose.connection.close()
        console.log("\nFinished!")
        process.exit(1)
    })
}
else {
    console.log("Creating a new person..\n")
    const new_person = new Person({
        name: process.argv[3],
        number: process.argv[4] || ""
    })
    new_person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to the phonebook`)
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
    }).finally(() => {
        mongoose.connection.close()
        console.log("\nFinished!")
        process.exit(1)
    })
}
