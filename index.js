const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'goodreads.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()

// Get Books API
app.get('/books/', async (request, response) => {
  const getBooksQuery = `
  SELECT
    *
  FROM
    book
  ORDER BY
    book_id;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})
//createuserlogin

app.post('/users/', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const hashedpass = bcrypt.hash(request.body.password, 10)
  const usercheck = `SELECT 
    * 
  FROM 
    user 
  WHERE 
    username = '${username};`
  const userrun = await db.get(usercheck)
  if (userrun === undefined) {
    const createuser = `INSERT INTO  user(username,name,password,gender,location) VALUES(${username},${name},${hashedpass},${gender},${location})`
    const ins = await db.run(createuser)
    console.log('user is crerated successfully')
  } else {
    response.send(400)
    resonse.send('user is already exists')
  }
})
