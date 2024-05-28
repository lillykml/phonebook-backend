require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get("/api/persons", (req, res) => {
    Person.find({}).then(people => res.json(people))
})

app.get("/api/info", (req, res) => {
    const requestTime = new Date();
    res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${requestTime}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else res.status(404).end()

})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*1000000)
  }

app.post("/api/persons", (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number) {
        return res.status(400).json({ 
        error: 'name or number missing' 
      })}

    if (phonebook.find(person => person.name === name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: req.body.name,
        number: req.body.number,
        id: generateId(),
    }

    phonebook = phonebook.concat(person)
    res.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})