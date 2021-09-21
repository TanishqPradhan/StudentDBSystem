const mysql = require("mysql");

//mysql connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

//view students
exports.view = (req, res) => {
  //connect to database
  pool.getConnection((err, connection) => {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);

    //Student connection
    connection.query("SELECT * FROM student", (err, rows) => {
      //release when done
      connection.release();

      if (!err) {
          let removedStudent = req.query.removed;
        res.render("home", { rows , removedStudent});
      } else {
        console.log(err);
      }

      console.log("the data from student table: \n", rows);
    });
  });
};

//search function
exports.find = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Connected as ID " + connection.threadId);
    
        let searchTerm = req.body.search;

        //Student connection
        connection.query("SELECT * FROM student WHERE first_name LIKE ? OR last_name LIKE ? OR student_id LIKE ?", ['%' + searchTerm + '%' , '%' + searchTerm + '%' , '%' + searchTerm + '%'], (err, rows) => {
          //release when done
          connection.release();
    
          if (!err) {
            res.render("home", { rows });
          } else {
            console.log(err);
          }
    
          console.log("the data from student table: \n", rows);
        });
      });
}


exports.form = (req, res) => {
    res.render('add-student')
}
//add new student
exports.create = (req, res) => {

    const { first_name, last_name, student_id, email, mailing_address, gpa } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log("Connected as ID " + connection.threadId);
    
        let searchTerm = req.body.search;

        //Student connection
        connection.query('INSERT INTO student SET first_name = ? , last_name = ?, student_id = ?, email = ?, mailing_address = ?, gpa = ?',[first_name, last_name, student_id, email, mailing_address, gpa], (err, rows) => {
          //release when done
          connection.release();
    
          if (!err) {
            res.render("add-student", {alert: 'Student Added Successfully'});
          } else {
            console.log(err);
          }
    
          console.log("the data from student table: \n", rows);
        });
      });
}


//edit student
exports.edit = (req, res) => {
//connect to database
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID " + connection.threadId);
  
      //Student connection
      connection.query("SELECT * FROM student WHERE id = ?",[ req.params.id], (err, rows) => {
        //release when done
        connection.release();
  
        if (!err) {
          res.render("edit-student", { rows });
        } else {
          console.log(err);
        }
  
        console.log("the data from student table: \n", rows);
      });
    });
  };


//update student
exports.update = (req, res) => {
    const { first_name, last_name, student_id, email, mailing_address, gpa } = req.body;

        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID " + connection.threadId);
      
          //Student connection
          connection.query("UPDATE student SET first_name = ?, last_name = ?, student_id = ?, email = ?, mailing_address = ?, gpa = ? WHERE id = ?",[first_name, last_name, student_id, email, mailing_address, gpa, req.params.id], (err, rows) => {
            //release when done
            connection.release();
      
            if (!err) {
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log("Connected as ID " + connection.threadId);
                
                    //Student connection
                    connection.query("SELECT * FROM student WHERE id = ?",[ req.params.id], (err, rows) => {
                      //release when done
                      connection.release();
                
                      if (!err) {
                        res.render("edit-student", { rows, alert: `${first_name} has been updated.` });
                      } else {
                        console.log(err);
                      }
                
                      console.log("the data from student table: \n", rows);
                    });
                  });

                
            } else {
              console.log(err);
            }
      
            console.log("the data from student table: \n", rows);
          });
        });
      };
    
//delete student
exports.delete = (req, res) => {
    //connect to database
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID " + connection.threadId);
      
          //Student connection
          connection.query("DELETE FROM student WHERE id = ?",[ req.params.id], (err, rows) => {
            //release when done
            connection.release();
      
            if (!err) { 
                let removedStudent = encodeURIComponent('User Successfully Removed.');
              res.redirect("/?removed=" + removedStudent);
            } else {
              console.log(err);
            }
      
            console.log("the data from student table: \n", rows);
          });
        });
      };