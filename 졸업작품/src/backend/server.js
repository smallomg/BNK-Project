const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const mysql = require('mysql2/promise');
const { OAuth2Client } = require('google-auth-library');
const interviewReviewRoutes = require('./interviewReviewRoutes');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 데이터베이스 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let db;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'lkwjefldirgjdrilgjdxrgldxfjtihftlg',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

require('./auth/googleStrategy')(passport);

app.use('/api', interviewReviewRoutes);

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// 데이터베이스 초기화 함수
async function initializeDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('MySQL 데이터베이스에 연결되었습니다.');

    // 기존 테이블들 생성 쿼리...

    // Resumes 테이블 생성 (없는 경우)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Resumes (
        ResumeID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        ProfilePicture VARCHAR(255),
        BirthDate DATE,
        Email VARCHAR(100) NOT NULL,
        PhoneNumber VARCHAR(20),
        Address TEXT,
        PersonalWebsite VARCHAR(255),
        Skills JSON,
        WorkExperience JSON,
        Education JSON,
        Certifications JSON,
        ExternalActivities JSON,
        TemplateID INT
      )
    `);
    console.log('Resumes 테이블이 확인/생성되었습니다.');
  } catch (err) {
    console.error('데이터베이스 초기화 오류:', err);
    process.exit(1);
  }
}

// Routes
app.get('/auth/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account',
    cookie: { secure: false }
  })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/auth/google/callback');
  }
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.UserID);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user with ID:', id);
  try {
    const [rows] = await db.execute('SELECT * FROM Users WHERE UserID = ?', [id]);
    if (rows.length === 0) {
      console.error('No user found with ID:', id);
      return done(null, false);
    }
    console.log('User deserialized:', rows[0]);
    return done(null, rows[0]);
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    return done(err);
  }
});

app.post('/auth/google/callback', (req, res) => {
  const userInfo = req.body;
  req.session.user = userInfo;

  req.session.save(err => {
    if (err) {
      console.error('세션 저장 오류:', err);
      return res.status(500).send({ message: '세션 저장 실패' });
    }
    res.send({ message: 'User logged in successfully', user: req.session.user });
  });
});

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // 콜백 대신 Promise 사용
    const [users] = await db.execute('SELECT * FROM Users WHERE GoogleID = ?', [googleId]);
    
    if (users.length > 0) {
      const user = users[0];
      await new Promise((resolve, reject) => {
        req.login(user, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return res.json({ success: true, message: 'User logged in successfully', user });
    } else {
      const newUser = { GoogleID: googleId, Email: email, Name: name };
      const [result] = await db.execute('INSERT INTO Users SET ?', [newUser]);
      newUser.UserID = result.insertId;
      
      await new Promise((resolve, reject) => {
        req.login(newUser, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return res.json({ success: true, message: 'New user created and logged in', user: newUser });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed', error: error.message });
  }
});

// 문서 목록 조회 API
app.get('/api/documents', (req, res) => {
  const query = 'SELECT * FROM documents';
  db.query(query, (err, results) => {
    if (err) {
      console.error('문서 조회 오류:', err);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    res.json(results);
  });
});

// 파일 정보 조회 API
app.get('/api/files/:id', (req, res) => {
  const fileId = req.params.id;
  const query = 'SELECT * FROM documents WHERE id = ?';
  db.query(query, [fileId], (err, results) => {
    if (err) {
      console.error('파일 조회 오류:', err);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: '파일을 찾을 수 없습니다' });
      return;
    }
    res.json(results[0]);
  });
});

// 평가 저장 API
app.post('/api/evaluations', (req, res) => {
  const { document_id, evaluator_id, rating, comment } = req.body;
  const query = 'INSERT INTO evaluations (document_id, evaluator_id, rating, comment) VALUES (?, ?, ?, ?)';
  db.query(query, [document_id, evaluator_id, rating, comment], (err, result) => {
    if (err) {
      console.error('평가 저장 오류:', err);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    res.status(201).json({ message: '평가가 성공적으로 저장되었습니다.', id: result.insertId });
  });
});

// 평가 목록 조회 API
app.get('/api/evaluations/:documentId', (req, res) => {
  const documentId = req.params.documentId;
  const query = 'SELECT * FROM evaluations WHERE document_id = ?';
  db.query(query, [documentId], (err, results) => {
    if (err) {
      console.error('평가 조회 오류:', err);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    res.json(results);
  });
});

// 문서 업로드 API
app.post('/api/documents', upload.single('file'), async (req, res) => {
  console.log('File upload request received');
  console.log('Request body:', req.body);
  if (req.file) {
    console.log('File uploaded:', req.file);
    const { type_id, job_role } = req.body;
    const title = req.file.originalname;
    const file_path = req.file.path;
    const user_id = 1; // 임시로 user_id를 1로 설정

    const query = 'INSERT INTO documents (user_id, type_id, title, file_path, job_role) VALUES (?, ?, ?, ?, ?)';
    try {
      const [result] = await db.execute(query, [user_id, type_id, title, file_path, job_role]);
      res.status(201).json({ message: '문서가 성공적으로 업로드되었습니다.', id: result.insertId });
    } catch (err) {
      console.error('문서 저장 오류:', err);
      res.status(500).json({ error: '서버 오류', details: err.message });
    }
  } else {
    console.error('No file uploaded');
    res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }
});

// AI 평가 결과 저장 API
app.post('/api/ai-evaluations', (req, res) => {
  const { user_id, total_score, ...scores } = req.body;
  const query = 'INSERT INTO ai_evaluations (user_id, total_score, education_score, certifications_score, language_score, awards_score, leadership_score, volunteer_score, activities_score, global_experience_score, portfolio_score, communication_score, problem_solving_score, time_management_score, networking_score, self_development_score, entrepreneurship_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [user_id, total_score, scores.education_score, scores.certifications_score, scores.language_score, scores.awards_score, scores.leadership_score, scores.volunteer_score, scores.activities_score, scores.global_experience_score, scores.portfolio_score, scores.communication_score, scores.problem_solving_score, scores.time_management_score, scores.networking_score, scores.self_development_score, scores.entrepreneurship_score];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('AI 평가 결과 저장 오류:', err);
      res.status(500).json({ error: '서버 오류' });
      return;
    }
    res.status(201).json({ message: 'AI 평가 결과가 성공적으로 저장되었습니다.', id: result.insertId });
  });
});

// 평가할 문서 목록 조회 API
app.get('/api/documents-to-evaluate', async (req, res) => {
  const query = `
    SELECT d.id, d.title, d.job_role, dt.name as type
    FROM documents d
    JOIN document_types dt ON d.type_id = dt.id
    LEFT JOIN evaluations e ON d.id = e.document_id
    WHERE e.id IS NULL
  `;
  try {
    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error('문서 조회 오류:', err);
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});

// 평가 완료된 문서 목록 조회 API (수정됨)
app.get('/api/completed-evaluations', async (req, res) => {
  console.log('GET /api/completed-evaluations 호출됨');
  const query = `
    SELECT d.id, d.title, d.job_role, dt.name as type, e.id as evaluation_id, e.rating, e.comment, e.evaluation_date
    FROM documents d
    JOIN document_types dt ON d.type_id = dt.id
    JOIN evaluations e ON d.id = e.document_id
    WHERE e.evaluator_id = ?
  `;
  const evaluatorId = 1; // 현재 로그인한 평가자의 ID로 필터링

  try {
    const [results] = await db.execute(query, [evaluatorId]);
    console.log('쿼리 결과:', results);
    res.json(results);
  } catch (err) {
    console.error('평가 완료 문서 조회 오류:', err);
    res.status(500).json({ 
      error: '서버 오류', 
      details: err.message,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState
    });
  }
});

 

// 평가 삭제 API (새로 추가됨)
app.delete('/api/evaluations/:id', async (req, res) => {
  const evaluationId = req.params.id;
  const query = 'DELETE FROM evaluations WHERE id = ?';

  try {
    const [result] = await db.execute(query, [evaluationId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '평가를 찾을 수 없습니다.' });
    } else {
      res.json({ message: '평가가 성공적으로 삭제되었습니다.' });
    }
  } catch (err) {
    console.error('평가 삭제 오류:', err);
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});

// 평가 수정 API (새로 추가됨)
app.put('/api/evaluations/:id', async (req, res) => {
  const evaluationId = req.params.id;
  const { rating, comment } = req.body;
  const query = 'UPDATE evaluations SET rating = ?, comment = ? WHERE id = ?';

  try {
    const [result] = await db.execute(query, [rating, comment, evaluationId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: '평가를 찾을 수 없습니다.' });
    } else {
      res.json({ message: '평가가 성공적으로 업데이트되었습니다.' });
    }
  } catch (err) {
    console.error('평가 업데이트 오류:', err);
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});



// 이력서 생성/업데이트
app.post('/saveResume', upload.single('ProfilePicture'), async (req, res) => {
  const { 
    ResumeID, Name, BirthDate, Email, PhoneNumber, Address, 
    PersonalWebsite, Skills, WorkExperience, Education, Certifications, 
    ExternalActivities, TemplateID
  } = req.body;

  const ProfilePicture = req.file ? req.file.path : null;

  if (!Name || !Email) {
    return res.status(400).json({ error: '이름과 이메일은 필수 입력 항목입니다.' });
  }

  try {
    let query;
    let values;
    let message;

    if (ResumeID) {
      query = `
      UPDATE Resumes SET
      Name = ?, ProfilePicture = ?, BirthDate = ?, Email = ?, PhoneNumber = ?, 
      Address = ?, PersonalWebsite = ?, Skills = ?, WorkExperience = ?, 
      Education = ?, Certifications = ?, ExternalActivities = ?, TemplateID = ?
      WHERE ResumeID = ?
    `;
    values = [
      Name, ProfilePicture, BirthDate, Email, PhoneNumber, Address, 
      PersonalWebsite, JSON.stringify(Skills), JSON.stringify(WorkExperience), 
      JSON.stringify(Education), JSON.stringify(Certifications), 
      JSON.stringify(ExternalActivities), TemplateID, ResumeID
    ];
    message = '이력서가 성공적으로 업데이트되었습니다.';
  } else {
    query = `
      INSERT INTO Resumes 
      (Name, ProfilePicture, BirthDate, Email, PhoneNumber, Address, 
      PersonalWebsite, Skills, WorkExperience, Education, Certifications, 
      ExternalActivities, TemplateID) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    values = [
      Name, ProfilePicture, BirthDate, Email, PhoneNumber, Address, 
      PersonalWebsite, JSON.stringify(Skills), JSON.stringify(WorkExperience), 
      JSON.stringify(Education), JSON.stringify(Certifications), 
      JSON.stringify(ExternalActivities), TemplateID
    ];
    message = '새 이력서가 성공적으로 생성되었습니다.';
  }

  const [result] = await db.execute(query, values);
  res.status(201).json({ 
    message: message,
    ResumeID: ResumeID || result.insertId,
    Name,
    TemplateID
  });
} catch (err) {
  console.error('이력서 저장 중 오류 발생:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.', details: err.message });
}
});

// 모든 이력서 조회
app.get('/resumes', async (req, res) => {
try {
  const [rows] = await db.execute('SELECT ResumeID, Name, Email, TemplateID FROM Resumes');
  res.json(rows);
} catch (err) {
  console.error('이력서 목록 조회 중 오류:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.' });
}
});

// 특정 이력서 조회 (PDF 다운로드를 위해 수정)
app.get('/resumes/:id', async (req, res) => {
const { id } = req.params;
try {
  const [rows] = await db.execute('SELECT * FROM Resumes WHERE ResumeID = ?', [id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: '이력서를 찾을 수 없습니다.' });
  }
  
  const resume = rows[0];
  // JSON 형식으로 저장된 필드들을 파싱
  const jsonFields = ['Skills', 'WorkExperience', 'Education', 'Certifications', 'ExternalActivities'];
  jsonFields.forEach(field => {
    if (resume[field]) {
      try {
        resume[field] = JSON.parse(resume[field]);
      } catch (error) {
        console.error(`${field} 파싱 중 오류:`, error);
        resume[field] = []; // 파싱 실패 시 빈 배열로 설정
      }
    } else {
      resume[field] = [];
    }
  });

  // 날짜 형식 처리
  if (resume.BirthDate) {
    resume.BirthDate = resume.BirthDate.toISOString().split('T')[0];
  }

  // ProfilePicture 처리
  if (resume.ProfilePicture) {
    try {
      const imageBuffer = await fs.readFile(resume.ProfilePicture);
      resume.ProfilePicture = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
      console.error('프로필 사진 로딩 중 오류:', error);
      resume.ProfilePicture = null;
    }
  }

  console.log('조회된 이력서:', resume); // 디버깅을 위한 로그
  res.json(resume);
} catch (err) {
  console.error('이력서 조회 중 오류:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.', details: err.message });
}
});

// 이력서 삭제
app.delete('/resumes/:id', async (req, res) => {
const { id } = req.params;
try {
  const [result] = await db.execute('DELETE FROM Resumes WHERE ResumeID = ?', [id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: '이력서를 찾을 수 없습니다.' });
  }
  res.json({ success: true, message: '이력서가 성공적으로 삭제되었습니다.' });
} catch (err) {
  console.error('이력서 삭제 중 오류:', err);
  res.status(500).json({ error: '서버 오류가 발생했습니다.', details: err.message });
}
});

// 자기소개서 생성 API (예시)
app.post('/coverletters', async (req, res) => {
  const { UserID, OriginalContent, Keywords } = req.body;
  
  try {
    // 여기에 자기소개서 생성 로직을 구현합니다.
    // 이 예시에서는 간단히 원본 내용을 그대로 반환합니다.
    const generatedContent = OriginalContent;

    // 생성된 자기소개서를 데이터베이스에 저장
    const query = 'INSERT INTO CoverLetters (UserID, OriginalContent, GeneratedContent, Keywords) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [UserID, OriginalContent, generatedContent, Keywords]);

    res.status(201).json({ 
      message: '자기소개서가 성공적으로 생성되었습니다.',
      id: result.insertId,
      generatedContent
    });
  } catch (err) {
    console.error('자기소개서 생성 중 오류 발생:', err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.', details: err.message });
  }
});


app.get('/api/qnaposts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM JobQnA ORDER BY PostDate DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 새 게시글 추가하기
app.post('/api/qnaposts', async (req, res) => {
  const { userID, JobCategory, Title, Content } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO JobQnA (UserID, JobCategory, Title, Content) VALUES (?, ?, ?, ?)',
      [userID, JobCategory, Title, Content]
    );
    const [newPost] = await db.query('SELECT * FROM JobQnA WHERE QuestionID = ?', [result.insertId]);
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error('Error adding new post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/qnaposts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE JobQnA SET Views = Views + 1 WHERE QuestionID = ?', [id]);
    const [rows] = await db.query('SELECT * FROM JobQnA WHERE QuestionID = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 게시글 추천
app.post('/api/qnaposts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE JobQnA SET Likes = Likes + 1 WHERE QuestionID = ?', [id]);
    const [rows] = await db.query('SELECT Likes FROM JobQnA WHERE QuestionID = ?', [id]);
    res.json({ likes: rows[0].Likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/qnaposts/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jobqna WHERE QuestionID = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // 조회수 증가
    await db.query('UPDATE jobqna SET Views = Views + 1 WHERE QuestionID = ?', [req.params.id]);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/qnaposts/:id/like', async (req, res) => {
  try {
    await db.query('UPDATE jobqna SET Likes = Likes + 1 WHERE QuestionID = ?', [req.params.id]);
    const [rows] = await db.query('SELECT Likes FROM jobqna WHERE QuestionID = ?', [req.params.id]);
    res.json({ likes: rows[0].Likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/qnaposts/:id/comments', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Comments WHERE QuestionID = ? ORDER BY CreatedAt DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/qnaposts/:id/comments', async (req, res) => {
  const { userID, content } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO comments (QuestionID, UserID, Content) VALUES (?, ?, ?)',
      [req.params.id, userID, content]
    );
    const [newComment] = await db.query('SELECT * FROM comments WHERE CommentID = ?', [result.insertId]);
    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('Error creating new comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 로드 공유용 파일 업로드 설정
const roadFileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/roads/')
  },
  filename: function (req, file, cb) {
    cb(null, `road_${Date.now()}${path.extname(file.originalname)}`)
  }
});

// Multer를 사용하여 파일 업로드를 처리하고 보안 검증을 수행
const roadUpload = multer({
  storage: roadFileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB 제한
  fileFilter: (req, file, cb) => {
    // PDF 파일 형식만 허용하여 보안 강화
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('PDF 파일만 업로드 가능합니다.'));
    }
  }
});

// 로드 공유 API들
// 게시글 목록 조회
app.get('/api/roads', async (req, res) => {
  const { type, education, position, document } = req.query;
  try {
    let query = `
      SELECT p.*, u.Name as UserName 
      FROM RoadPosts p
      JOIN Users u ON p.UserID = u.UserID
      WHERE 1=1
    `;
    const values = [];

    if (type) {
      query += ' AND p.Type = ?';
      values.push(type);
    }
    if (education) {
      query += ' AND JSON_CONTAINS(p.Tags, ?)';
      values.push(JSON.stringify(education));
    }
    if (position) {
      query += ' AND p.Position = ?';
      values.push(position);
    }
    if (document) {
      query += ' AND JSON_CONTAINS(p.Tags, ?)';
      values.push(JSON.stringify(document));
    }

    const [posts] = await db.execute(query, values);
    res.json(posts);
  } catch (err) {
    console.error('로드 게시글 조회 오류:', err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 게시글 작성
app.post('/api/roads', roadUpload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userID, type, subtitle, author, position, education } = req.body;
    const files = req.files || {};
    const userId = userID; // 테스트용

    if (!type || !subtitle || !author || !position || !education) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    // 태그 배열 생성
    const tags = [
      education,
      position,
      files.resume ? "이력서" : null,
      files.coverLetter ? "자기소개서" : null,
      files.portfolio ? "포트폴리오" : null
    ].filter(Boolean);  // undefined/null 값 제거

    // 파일 정보 생성
    const filesData = {};
    for (const fileType in files) {
      const file = files[fileType][0];
      filesData[fileType] = {
        path: file.path,
        originalName: file.originalname
      };
    }

    console.log('Saving data:', {
      userId,
      type,
      subtitle,
      author,
      position,
      education,
      tags,
      filesData
    });

    const [result] = await db.execute(
      `INSERT INTO RoadPosts 
      (UserID, Type, Title, Subtitle, Author, Position, Education, Tags, Files) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        type,
        type,
        subtitle,
        author,
        position,
        education,
        JSON.stringify(tags),
        JSON.stringify(filesData)
      ]
    );

    // 새로 생성된 게시글 조회
    const [newPost] = await db.execute(
      `SELECT p.*, u.Name as UserName 
       FROM RoadPosts p 
       JOIN Users u ON p.UserID = u.UserID 
       WHERE p.PostID = ?`,
      [result.insertId]
    );

    if (newPost.length === 0) {
      throw new Error('게시글 생성 후 조회 실패');
    }

    res.status(201).json(newPost[0]);
  } catch (err) {
    console.error('게시글 작성 오류:', err);
    res.status(500).json({ 
      error: '서버 오류가 발생했습니다.', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// 게시글 상세 조회
app.get('/api/roads/:id', async (req, res) => {
  try {
    console.log('Received request for road ID:', req.params.id);  // 디버깅용 로그

    const [posts] = await db.execute(
      `SELECT p.*, u.Name as UserName 
       FROM RoadPosts p 
       LEFT JOIN Users u ON p.UserID = u.UserID 
       WHERE p.PostID = ?`,
      [req.params.id]
    );

    console.log('Query result:', posts);  // 디버깅용 로그

    if (posts.length === 0) {
      return res.status(404).json({ 
        error: '게시글을 찾을 수 없습니다.',
        requestedId: req.params.id 
      });
    }

    const post = posts[0];

    // Files와 Tags가 문자열로 저장되어 있다면 파싱
    try {
      if (post.Files) {
        post.Files = typeof post.Files === 'string' ? post.Files : JSON.stringify(post.Files);
      }
      if (post.Tags) {
        post.Tags = typeof post.Tags === 'string' ? post.Tags : JSON.stringify(post.Tags);
      }
    } catch (parseErr) {
      console.error('Error parsing JSON fields:', parseErr);
    }

    res.json(post);
  } catch (err) {
    console.error('Error fetching road data:', err);
    res.status(500).json({ 
      error: '서버 오류가 발생했습니다.', 
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// 파일 다운로드
app.get('/api/roads/download/:postId/:fileType', async (req, res) => {
  try {
    const { postId, fileType } = req.params;
    console.log('Download request for:', { postId, fileType });

    const [posts] = await db.execute(
      'SELECT Files FROM RoadPosts WHERE PostID = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    let files = posts[0].Files;
    if (typeof files === 'string') {
      try {
        files = JSON.parse(files);
      } catch (err) {
        console.error('Error parsing Files JSON:', err);
        return res.status(500).json({ error: '파일 정보 파싱 오류' });
      }
    }

    console.log('Files data:', files);

    const fileInfo = files[fileType];
    if (!fileInfo || !fileInfo.path) {
      return res.status(404).json({ error: '파일 정보를 찾을 수 없습니다.' });
    }

    const filePath = path.resolve(fileInfo.path);
    console.log('Attempting to download file from:', filePath);

    // fs.access 수정
    try {
      await fsPromises.access(filePath, fs.constants.F_OK);
      
      // 파일이 존재하면 다운로드 진행
      res.download(filePath, fileInfo.originalName, (err) => {
        if (err) {
          console.error('File download error:', err);
          if (!res.headersSent) {
            res.status(500).json({ error: '파일 다운로드 중 오류가 발생했습니다.' });
          }
        }
      });
    } catch (err) {
      console.error('File access error:', err);
      return res.status(404).json({ error: '파일이 서버에 존재하지 않습니다.' });
    }

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: '서버 오류가 발생했습니다.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


// 데이터베이스 초기화 및 서버 시작
initializeDatabase().then(() => {
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
}).catch(err => {
console.error('데이터베이스 초기화 실패:', err);
process.exit(1);
});