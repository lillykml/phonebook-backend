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


app.get("/api/info", (req, res) => {
    const requestTime = new Date();
    res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${requestTime}</p>`)
})


app.get("/api/persons", (req, res) => {
  Person.find({}).then(people => res.json(people))
})


app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
  .then(person => {
    if (person) {
      res.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
    // const id = Number(req.params.id)
    // const person = phonebook.find(person => person.id === id)
    // if (person) {
    //     res.json(person)
    // } else res.status(404).end()
})


app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})


app.post("/api/persons", (req, res) => {
    const name = req.body.name
    const number = req.body.number

    if (!name || !number) {
        return res.status(400).json({ 
        error: 'name or number missing' 
      })}

    // if (phonebook.find(person => person.name === name)) {
    //     return res.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person ({
        name: name,
        number: number,
    })

    person.save()
    .then(newPerson => res.json(newPerson))
    .catch(error => next(error))

    // phonebook = phonebook.concat(person)
    // res.json(person)
})

app.put("/api/persons/:id", (req, res, next) => {
    const name = req.body.name
    const number = req.body.number

    const person = {name: name, number: number}

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})