const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();
const mysql         = require('mysql');

// DYNAMIC ENV VAR
const mysql_host = process.env.MYSQL_HOST;
const mysql_port = process.env.MYSQL_PORT;
const mysql_user = process.env.MYSQL_USER;
const mysql_pass = process.env.MYSQL_PASSWORD;
const mysql_name = process.env.MYSQL_DBNAME;

//parse application/json
app.use(bodyParser.json());

//create database connection
const conn = mysql.createConnection({
    host: mysql_host,
    port: mysql_port,
    user: mysql_user,
    password: mysql_pass,
    database: mysql_name
});

//connect to database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected !!')
});

//ACTIVITY
//tampilkan semua data activity
app.get('/activity-groups',(req, res) => {
    let sql = "SELECT * FROM activity WHERE deleted_at IS NULL"
    conn.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": results}))
    });
});
//tampilkan data activity berdasarkan id
app.get('/activity-groups/:id',(req, res) => {
    let sql = "SELECT * FROM activity WHERE deleted_at IS NULL AND id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result}));
    });
});
//tambahkan data activity baru
app.post('/activity-groups',(req, res) => {
    let data = {email: req.body.email, title: req.body.title};
    let sql  = "INSERT INTO activity SET ?";
    conn.query(sql, data, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        let sql1 = "SELECT created_at, updated_at, id, title, email FROM activity WHERE id="+result.insertId;
        conn.query(sql1, (err, result1) => {
            if (err) {
                res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
                return
            }
            res.status(201).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result1}));
        });
    });
});
//edit data activity berdasarkan id
app.patch('/activity-groups/:id',(req, res) => {
    let data = [];
    let i = 0;
    for (const [key, value] of Object.entries(req.body)) {
        data[i] = key+" = '"+value+"'";
        i++
    }
    let sql = "UPDATE activity SET "+data+" WHERE deleted_at IS NULL AND id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        let sql1 = "SELECT * FROM activity WHERE deleted_at IS NULL AND id="+req.params.id;
        conn.query(sql1, (err, result1) => {
            if (err) {
                res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
                return
            }
            res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result1}));
        });
    });
});
//delete data activity berdasarkan id
app.delete('/activity-groups/:id',(req, res) => {
    let sql = "UPDATE activity SET deleted_at = NOW() WHERE id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(404).send(JSON.stringify({"status": 'Not Found', "message": 'Activity with ID '+req.params.id+' Not Found', "data": ''}));
    });
});

//TODO
//tampilkan semua data todo
app.get('/todo-items',(req, res) => {
    let sql = "SELECT * FROM todo WHERE deleted_at IS NULL AND activity_group_id = "+req.query.activity_group_id;
    conn.query(sql, (err, results) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": results}))
    });
});
//tampilkan data todo berdasarkan id
app.get('/todo-items/:id',(req, res) => {
    let sql = "SELECT * FROM todo WHERE deleted_at IS NULL AND id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result}));
    });
});
//tambahkan data todo baru
app.post('/todo-items',(req, res) => {
    let data = {title: req.body.title, activity_group_id: req.body.activity_group_id, is_active: req.body.is_active, priority: req.body.priority};
    let sql  = "INSERT INTO todo SET ?";
    conn.query(sql, data, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        let sql1 = "SELECT created_at, updated_at, id, title, activity_group_id, is_active, priority FROM todo WHERE id="+result.insertId;
        conn.query(sql1, (err, result1) => {
            if (err) {
                res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
                return
            }
            res.status(201).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result1}));
        });
    });
});
//edit data todo berdasarkan id
app.patch('/todo-items/:id',(req, res) => {
    let data = [];
    let i = 0;
    for (const [key, value] of Object.entries(req.body)) {
        data[i] = key+" = '"+value+"'";
        i++
    }
    let sql = "UPDATE todo SET "+data+" WHERE deleted_at IS NULL AND id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        let sql1 = "SELECT * FROM todo WHERE deleted_at IS NULL AND id="+req.params.id;
        conn.query(sql1, (err, result1) => {
            if (err) {
                res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
                return
            }
            res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": result1}));
        });
    });
});
//delete data todo berdasarkan id
app.delete('/todo-items/:id',(req, res) => {
    let sql = "UPDATE todo SET deleted_at = NOW() WHERE id="+req.params.id;
    conn.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(JSON.stringify({"status": 'Error', "message": err}))
            return
        }
        res.status(200).send(JSON.stringify({"status": 'Success', "message": 'Success', "data": ''}));
    });
});

//server listening
app.listen(3030,() => {
    console.log('Server dimulai diport 3030 !!')
})