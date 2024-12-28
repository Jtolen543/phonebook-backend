const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(
        `
        <h2> Phonebook has info for ${persons.length} people </h2>
        <p> ${now} </p>
        `
    )
})

app.get('/api/persons', (request, response) => {   
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    persons = persons.filter(person => Number(person.id) !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    let id = 1
    while(persons.some(person => Number(person.id) === id)) {
        id++    
    }
    if (!body.name) {
        return response.status(400).json({error: 'name missing'})
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    }
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



