const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

morgan.token('body', (req, res) => {
	if (req.method === "POST")
		return JSON.stringify(req.body);
	return " ";
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get('/info', (req, res) => {
	const numberOfEntries = persons.length;
	const currentDateTime = new Date;

	res.status(200).send( `
		<p>Phone book has info for ${numberOfEntries} people</p>
		<p>${currentDateTime}</p>`)
});


app.get('/api/persons', (req, res) => {
	res.json(persons);
});


app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(entry => entry.id === id)

  if (person)
	res.json(person);
  else
	res.status(404).send("404: No such entry in the phonebook")
});


app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(entry => entry.id === id);
	if(!person)
		return res.status(404).send("No such entry in the phonebook");
	persons = persons.find(entry => entry.id !== id);
	res.status(204).end()
});


app.post('/api/persons', (req, res) => {
	const body = req.body;

	if (!body.name){
		return res.status(400).json({
			error: "Name missing",
		})
	}
	else if (!body.number) {
      return res.status(400).json({
        error: "Phone number missing",
      });
    }

	const person = {
		name: body.name,
		number: body.number,
		id: Math.floor(Math.random() * 10e10)
	}

	persons = persons.concat(person);

	res.json(person);
});


const PORT = 3001;
app.listen(PORT);
console.log("Server running...")