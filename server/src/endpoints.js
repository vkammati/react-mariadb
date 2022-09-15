const mariadb = require('mariadb/callback')
const users = require('./seed-data/users')
const assessment = require('./seed-data/assessment')
const feedback = require('./seed-data/feedback')

// Create Mariadb connection
const db = mariadb.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'root',
  port      : "3306",
  database  : 'react_node'
}) 

// Connect to Mariadb database
db.connect(err => {
  if (err) {
    console.log("Mariadb not connected due to error: " + err);
  } else {
    console.log("Mariadb database connected successfully... " + db.threadId);
  }
});


// todo: implement persistence
const reviews = {}
users.forEach(u => reviews[String(u.id)] = assessment)

// todo: replace header check with auth
/*
function routes (app) {
  app.get('/users', (req, res) => {
    res.send(users)
  })
*/
function routes (app) {
  
  // Get employees
  app.get('/employees', (req, res) => {
    let sql = 'SELECT * FROM employees'
    let query = db.query(sql, (err, results) => {
      if(err) throw err
      console.log(results)
      res.send(results)
    })
  })
 
  // Edit employee
  app.post('/editemployee', (req, res) => {
    console.log('Updating employee...')
    console.log(req.body)
    let sql = `UPDATE employees SET name = '${req.body.newname}' WHERE id = ${req.body.userid}`
    let query = db.query(sql, (err, result) => {
      if(err) throw err
      console.log(result)
      res.send(result)
    })
  })

  // Insert a new employee
  app.post('/addemployee', (req, res) => {
    console.log('Inserting a new employee...')
    console.log(req.body)
    let sql = `INSERT INTO employees (adminid, name) VALUES (1, '${req.body.newname}')`
    let query = db.query(sql, (err, result) => {
      if(err) throw err
      console.log(result)
      res.send('Employee added...')
    })
  })

  // Create/edit performance review
  app.post('/performance', (req, res) => {
    console.log('Updating performance...')
    console.log(req.body)
    let sql = `INSERT INTO performreview (refid, content) VALUES(${req.body.userid}, '${req.body.content}') ON DUPLICATE KEY UPDATE content = '${req.body.content}'`
    let query = db.query(sql, (err, result) => {
      if(err) throw err
      console.log(result)
      res.send(result)
    })
  })

  // Get performance review
  console.log('Getting performance review...')
  app.get('/getperformance/:id', (req, res) => {
    let sql = `SELECT * FROM performreview WHERE refid = ${req.params.id}`
    let query = db.query(sql, (err, result) => {
      if(err) throw err
      console.log(result)
      res.send(result)
    })
  })


  // Delete employee
  console.log('Deleting employee...')
  app.get('/deleteemployee/:id', (req, res) => {
    let sql = `DELETE FROM employees WHERE id = ${req.params.id}`
    let query = db.query(sql, (err, result) => {
      if(err) throw err
      console.log(result)
      res.send('Employee deleted...')
    })
  })

}

module.exports = routes
