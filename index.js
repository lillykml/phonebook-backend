const express = require("express")
const app = express()
app.use(express.json())

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(phonebook)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})