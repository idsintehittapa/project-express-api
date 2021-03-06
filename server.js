import bodyParser from 'body-parser'
import cors from 'cors'

//import data
import profanityDictionary from './data/profanity-dictionary.json'
import profanityCategories from './data/profanity-dictionary-categories.json'

//import doc
import documentation from './documentation/idsintehittapa-profanity-dictionary-1.0.0-resolved.json'

// Defines the port the app will run on.
import express from 'express'
const port = process.env.PORT || 8080
const app = express()

// // Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// homepage
app.get('/', (req, res) => {
  res.send(documentation)
})


app.get('/curses', (req, res) => {
  const { language, category_id } = req.query
  let curseList = profanityDictionary
  
  // query by category_id
  if (category_id) {
    curseList = curseList.filter((curses) => curses.category_id === +category_id)
  }

  // query by language
  if (language) {
    curseList = curseList.filter((curses) => curses.language.toString().toLocaleLowerCase().includes(language.toLocaleLowerCase()))
  }

  // display total nrs of items in array
  const totalCurses = curseList.length

  // adding pagination using slice
  const page = req.query.page ?? 0 //otherwise 0 as default 
  const pageSize = req.query.pageSize ?? 20 //otherwise 20 as default 

  // calculate start index
  const startIndex = page * pageSize

  // calculate and bound the end index
  const endIndex = startIndex + pageSize

  const cursesPerPage = curseList.slice(startIndex, endIndex)
  const returnObject = { totalNumCurses: totalCurses, startIndex: startIndex, endIndex: endIndex, numCurses: cursesPerPage.length, cursesPerPage}

  res.json(returnObject)
})

// rout by single item from collection
app.get('/curses/:id', (req, res) => {
  const { id } = req.params
  const curseId = profanityDictionary.find((curses) => curses.id === +id)
  if (!curseId) {
    res
    .status(404)
    .send({ error: `No source with id "${id}" found`})
  }
  res.json(curseId)
})

//rout by category
app.get('/categories', (req, res) => {
  res.json(profanityCategories)
})

// // Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})