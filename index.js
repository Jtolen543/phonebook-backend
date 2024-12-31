require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response, next) => {
    const now = new Date()
    Person.countDocuments({}).then(count => {
        response.send(
            `
            <h2> Phonebook has info for ${count} people </h2>
            <p> ${now} </p>
            `
        )
    }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {   
    Person.find({}).then(persons => {
        response.json(persons)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            return response.json(person)
        } else {
            return response.status(404)
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    
    Person.deleteOne({_id: id}).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    Person.findOne({name: body.name}).then(person => {
        if (person) {
            return response.status(400).json({error: 'name must be unique'})
        }
        const new_person = new Person({
            name: body.name,
            number: body.number
        })
        new_person.save().then(savedPerson => {
            return response.json(savedPerson)
        }).catch(error => next(error))
    })

})

// Update a person's number
app.put('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)
    Person.updateOne({name: body.name}, {$set:{number: body.number}}).then(result => {
        return response.json(result)
    }).catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



