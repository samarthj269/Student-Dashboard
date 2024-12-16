
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/user', userRoutes);


mongoose.connect('mongodb+srv://user:user1@cluster0.bvm7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));


const readJsonFile = (filePath, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).json({ error: 'Error reading data' });
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).json({ error: 'Error parsing data' });
    }
  });
};


app.get('/api/student-profile', async (req, res) => {
  const studentFilePath = path.join(__dirname, 'data', 'studentProfile.json');
  const addressFilePath = path.join(__dirname, 'data', 'addressDetails.json');
  const skillFilePath = path.join(__dirname, 'data', 'skillDetails.json');

  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

   
    const studentData = JSON.parse(await fs.promises.readFile(studentFilePath, 'utf8'));
    const addressData = JSON.parse(await fs.promises.readFile(addressFilePath, 'utf8'));
    const skillData = JSON.parse(await fs.promises.readFile(skillFilePath, 'utf8'));

    
    const student = studentData.find(s => s.Student_Id === studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    
    const address = addressData.find(addr => addr.Student_Id === studentId);

    
    const skills = skillData.filter(skill => skill.Student_Id === studentId).map(skill => skill.skills);

   
    const studentProfile = {
      Student_Id: student.Student_Id,
      Name: student.Name,
      Gender: student.Gender,
      LinkedIn_Id: student.LinkedIn_Id,
      Email_Id: student.Email_Id,
      Contact_No: student["Contact_No."],
      University_Name: student["University Name"],
      Qualification: student.Qualification,
      cv_Name: student.cv_Name,
      CV_Link: student.CV_Link,
      Brand: student.Brand,
      address: address ? {
        Address_id: address.Address_id,
        house_no: address.house_no,
        street_name: address.street_name,
        city: address.city,
        district: address.district,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        full_address: address.full_address
      } : null,
      skills: skills
    };

    
    res.json(studentProfile);
  } catch (error) {
    console.error('Error reading student profile data:', error);
    res.status(500).json({ error: 'Error reading student profile data' });
  }
});



app.get('/api/course-details', async (req, res) => {
  const studentFilePath = path.join(__dirname, 'data', 'studentDetails.json');
  const courseFilePath = path.join(__dirname, 'data', 'courseDetails.json');
  const batchFilePath = path.join(__dirname, 'data', 'batchDetails.json');
  const brandFilePath = path.join(__dirname, 'data', 'brandDetails.json'); 

  try {
    console.log('Received request for course and batch details with studentId:', req.query.studentId);

    
    const studentData = JSON.parse(await fs.promises.readFile(studentFilePath, 'utf8'));
    const students = studentData.filter(s => s.Student_Id === req.query.studentId);

    if (!students || students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    
    const courseIds = students.map(student => student.course_id);
    const batchIds = students.map(student => student.Batch); 

    
    const courseData = JSON.parse(await fs.promises.readFile(courseFilePath, 'utf8'));
    const batchData = JSON.parse(await fs.promises.readFile(batchFilePath, 'utf8'));
    const brandData = JSON.parse(await fs.promises.readFile(brandFilePath, 'utf8'));

    
    const courseDetails = courseData.filter(course => courseIds.includes(course.course_id));
    const batchDetails = batchData.filter(batch => batchIds.includes(batch.batch_id));

    
    const combinedDetails = students.map(student => {
      const studentCourses = courseDetails
        .filter(course => course.course_id === student.course_id)
        .map(course => {
          
          const brandInfo = brandData.find(brand => brand.brand_id === course.brand_id);
          return {
            ...course,
            brand: brandInfo ? brandInfo.brand : 'N/A', 
            brandDomain: brandInfo ? brandInfo.domain : 'N/A', 
            brandUrl: brandInfo ? brandInfo.url : 'N/A', 
          };
        });
      const studentBatch = batchDetails.find(batch => batch.batch_id === student.Batch); 
      return {
        ...student,
        courses: studentCourses,
        batch: studentBatch || null, 
      };
    });

    
    res.json(combinedDetails);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Error reading course, batch, and brand details' });
  }
});


app.get('/api/payment-details', async (req, res) => {
  const paymentFilePath = path.join(__dirname, 'data', 'paymentDetails.json');
  const stipendFilePath = path.join(__dirname, 'data', 'stipendDetails.json');
  const loanPartnerFilePath = path.join(__dirname, 'data', 'loanpartnerDetails.json');
  const courseFeeFilePath = path.join(__dirname, 'data', 'coursefeeDetails.json');
  const courseDetailsFilePath = path.join(__dirname, 'data', 'courseDetails.json'); 

  const studentId = req.query.studentId; 

  try {
    const paymentData = JSON.parse(await fs.promises.readFile(paymentFilePath, 'utf8'));
    const stipendData = JSON.parse(await fs.promises.readFile(stipendFilePath, 'utf8'));
    const loanPartnerData = JSON.parse(await fs.promises.readFile(loanPartnerFilePath, 'utf8'));
    const courseFeeData = JSON.parse(await fs.promises.readFile(courseFeeFilePath, 'utf8'));
    const courseDetailsData = JSON.parse(await fs.promises.readFile(courseDetailsFilePath, 'utf8')); 

    
    const filteredPaymentData = paymentData.filter(payment => payment.Student_Id === studentId);

    const combinedData = filteredPaymentData.map(payment => {
      const stipend = stipendData.find(s => s.student_course_id === payment.student_course_id);

      if (stipend) {
        const loanPartner = loanPartnerData.find(lp => lp.partner_id === stipend.partner_id);
        const courseFee = courseFeeData.find(cf => cf.fee_id === stipend.fee_id);
        
        
        const course = courseDetailsData.find(cd => cd.course_id === courseFee?.course_id);
        const courseName = course ? course.Courses : 'N/A';

        if (loanPartner && courseFee) {
          return {
            ...payment,
            stipend: stipend,
            loanPartner: loanPartner,
            courseFee: courseFee,
            courseName: courseName 
          };
        }
      }
      return null;
    }).filter(item => item !== null);

    res.json(combinedData);
  } catch (error) {
    console.error('Error reading data files:', error);
    res.status(500).json({ error: 'Error reading payment, stipend, or course details' });
  }
});

app.get('/api/communication-details', async (req, res) => {
  const communicationFilePath = path.join(__dirname, 'data', 'communicationDetails.json');
  const employeeFilePath = path.join(__dirname, 'data', 'empInfo.json');

  try {
   
    const communicationData = JSON.parse(await fs.promises.readFile(communicationFilePath, 'utf8'));
    const employeeData = JSON.parse(await fs.promises.readFile(employeeFilePath, 'utf8'));

    
    const combinedData = communicationData.map(communication => {
      const employee = employeeData.find(emp => emp.employee_id === communication.Caller_id);
      return {
        ...communication,
        employee: employee || null, 
      };
    });

    res.json(combinedData);
  } catch (error) {
    console.error('Error reading communication or employee data:', error);
    res.status(500).json({ error: 'Error reading communication and employee details' });
  }
});

app.get('/api/opportunity-details', async (req, res) => {
  const opportunityFilePath = path.join(__dirname, 'data', 'opportunityDetails.json');
  const jdFilePath = path.join(__dirname, 'data', 'jdDetails.json');
  const companyFilePath = path.join(__dirname, 'data', 'companyDetails.json');

  try {
    
    const opportunityData = JSON.parse(await fs.promises.readFile(opportunityFilePath, 'utf8'));
    const studentOpportunities = opportunityData.filter(opportunity => opportunity.Student_Id === req.query.studentId);

    if (!studentOpportunities || studentOpportunities.length === 0) {
      return res.status(404).json({ error: 'No opportunities found for this student.' });
    }

    
    const opportunitiesWithDetails = await Promise.all(studentOpportunities.map(async (opportunity) => {
      
      const jdData = JSON.parse(await fs.promises.readFile(jdFilePath, 'utf8'));
      const jobDescription = jdData.find(jd => jd.jd_id === opportunity.jd_id);

      
      const companyData = JSON.parse(await fs.promises.readFile(companyFilePath, 'utf8'));
      const companyDetails = companyData.find(company => company.company_id === (jobDescription ? jobDescription.company_id : null));

      return {
        ...opportunity,
        jobDescription: jobDescription || null,
        companyDetails: companyDetails || null,
      };
    }));

    res.json(opportunitiesWithDetails);
  } catch (error) {
    console.error('Error reading opportunity, JD, or company data:', error);
    res.status(500).json({ error: 'Error reading opportunity details' });
  }
});

app.get('/api/assignment-details', async (req, res) => {
  const studentFilePath = path.join(__dirname, 'data', 'studentDetails.json');
  const assignmentFilePath = path.join(__dirname, 'data', 'assignmentDetails.json');
  const certificationFilePath = path.join(__dirname, 'data', 'certificationDetails.json');

  try {
    
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    
    const studentData = JSON.parse(await fs.promises.readFile(studentFilePath, 'utf8'));
    const student = studentData.find(s => s.Student_Id === studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    
    const studentCourseId = student.student_course_id;

    
    const assignmentData = JSON.parse(await fs.promises.readFile(assignmentFilePath, 'utf8'));
    const assignments = assignmentData.filter(a => a.student_course_id === studentCourseId);

   
    const certificationData = JSON.parse(await fs.promises.readFile(certificationFilePath, 'utf8'));
    const certifications = certificationData.filter(c => c.student_course_id === studentCourseId);

    
    const result = {
      student,
      assignments,
      certifications
    };

    res.json(result);
  } catch (error) {
    console.error('Error reading assignment or certification data:', error);
    res.status(500).json({ error: 'Error reading assignment or certification details' });
  }
});


app.get('/api/session-details', async (req, res) => {
  const sessionFilePath = path.join(__dirname, 'data', 'sessionDetails.json');
  const mentorFilePath = path.join(__dirname, 'data', 'mentorDetails.json');

  try {
    
    const sessionData = JSON.parse(await fs.promises.readFile(sessionFilePath, 'utf8'));
    const studentSessions = sessionData.filter(session => session.Student_Id === req.query.studentId);

    if (!studentSessions || studentSessions.length === 0) {
      return res.status(404).json({ error: 'No mentoring sessions found for this student.' });
    }

    
    const mentorsData = JSON.parse(await fs.promises.readFile(mentorFilePath, 'utf8'));
    const sessionsWithMentorDetails = studentSessions.map(session => {
      const mentorDetails = mentorsData.find(mentor => mentor.mentor_id === session.mentor_id);
      return {
        ...session,
        mentorDetails: mentorDetails || null, 
      };
    });

    res.json(sessionsWithMentorDetails);
  } catch (error) {
    console.error('Error reading session or mentor data:', error);
    res.status(500).json({ error: 'Error reading session details' });
  }
});



app.get('/api/earning', async (req, res) => {
  const opportunityFilePath = path.join(__dirname, 'data', 'opportunityearningDetails.json');
  const earningFilePath = path.join(__dirname, 'data', 'earningDetails.json');

  try {
      const { studentId } = req.query;

      if (!studentId) {
          return res.status(400).json({ error: 'Student ID is required' });
      }

      
      const opportunityData = JSON.parse(await fs.promises.readFile(opportunityFilePath, 'utf8'));

      
      const studentOpportunities = opportunityData.filter(opportunity => opportunity.Student_Id === studentId);

      if (studentOpportunities.length === 0) {
          return res.status(404).json({ error: 'No opportunities found for this student.' });
      }

      
      const earningData = JSON.parse(await fs.promises.readFile(earningFilePath, 'utf8'));

      
      const earningsWithOpportunities = studentOpportunities.map(opportunity => {
          const earningDetails = earningData.find(earning => earning.opportunity_id === opportunity.opportunity_id);
          
          return {
              ...opportunity,
              earnings: earningDetails || null, 
          };
      });

      res.json(earningsWithOpportunities);
  } catch (error) {
      console.error('Error reading opportunity or earning data:', error);
      res.status(500).json({ error: 'Error reading opportunity and earning details' });
  }
});



app.get('/api/timeline', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'timeline.json');
  readJsonFile(filePath, res);
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

