const express = require('express');
const router = express.Router();
const db = require('./db/database');

// Get all interview reviews
router.get('/interview-reviews', (req, res) => {
  const query = 'SELECT * FROM InterviewReviews ORDER BY PostDate DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching interview reviews:', err);
      res.status(500).json({ error: 'An error occurred while fetching interview reviews' });
    } else {
      res.json(results);
    }
  });
});

// Create a new interview review
router.post('/interview-reviews', (req, res) => {
  console.log(req.body);
   const { 
    UserID, CompanyName, Position, Region, PassStatus, EmploymentType,
    ReviewDate, Difficulty, InterviewerCount, InterviewType, 
    InterviewQuestion, InterviewerResponse, InterviewAtmosphere,
    InterviewRegrets, InterviewerAttitude, CompanyAtmosphere
  } = req.body;
  
 

  const query = `
    INSERT INTO InterviewReviews 
    (UserID, CompanyName, Position, Region, PassStatus, EmploymentType,
    ReviewDate, Difficulty, InterviewerCount, InterviewType, 
    InterviewQuestion, InterviewerResponse, InterviewAtmosphere,
    InterviewRegrets, InterviewerAttitude, CompanyAtmosphere)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    UserID, CompanyName, Position, Region, PassStatus, EmploymentType,
    ReviewDate, Difficulty, InterviewerCount, InterviewType, 
    InterviewQuestion, InterviewerResponse, InterviewAtmosphere,
    InterviewRegrets, InterviewerAttitude, CompanyAtmosphere
  ];
  console.log('SQL Query:', db.format(query, values));
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating interview review:', err);
      res.status(500).json({ error: 'An error occurred while creating the interview review' });
    } else {
      console.log('Insert Result:', result); // 결과 출력
      res.status(201).json({ message: 'Interview review created successfully', id: result.insertId });
    }
  });

});


module.exports = router;