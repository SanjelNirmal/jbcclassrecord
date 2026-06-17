export const PROGRAMS = ['BCA', 'BBS', 'BSW', 'BICTE'];

export const ACADEMIC_YEARS = ['2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090'];

export const NEPALI_MONTHS = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 
  'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const SUBJECT_MAPPING: Record<string, Record<string, string[]>> = {
  BCA: {
    'Semester 1': [
      'Computer Fundamentals & Applications',
      'Society & Technology',
      'English I',
      'Mathematics I',
      'Digital Logic'
    ],
    'Semester 2': [
      'C Programming',
      'Financial Accounting',
      'English II',
      'Mathematics II',
      'Microprocessor and Computer Architecture'
    ],
    'Semester 3': [
      'Data Structures & Algorithms',
      'Probability and Statistics',
      'System Analysis and Design',
      'Object-Oriented Programming in Java',
      'Web Technology'
    ],
    'Semester 4': [
      'Operating Systems',
      'Database Management System',
      'Numerical Methods',
      'Software Engineering',
      'Scripting Language',
      'Project I'
    ],
    'Semester 5': [
      'Computer Networks',
      'Computer Graphics & Animation',
      'Management Information System',
      'Dot Net Technology',
      'Mobile Application Development'
    ],
    'Semester 6': [
      'Network Administration',
      'Cyber Law & Professional Ethics',
      'Cloud Computing',
      'Project II (Minor Project)',
      'Elective I'
    ],
    'Semester 7': [
      'Artificial Intelligence',
      'E-Commerce',
      'Data Warehousing & Data Mining',
      'Project III (Major Project)',
      'Elective II'
    ],
    'Semester 8': [
      'Internship',
      'Project IV (Term Paper/Seminar)'
    ]
  },
  BBS: {
    'Year 1': [
      'Business English',
      'Business Statistics',
      'Microeconomics for Business',
      'Financial Accounting and Analysis',
      'Principles of Management'
    ],
    'Year 2': [
      'Business Communication',
      'Macroeconomics for Business',
      'Cost and Management Accounting',
      'Organizational Behavior & Human Resource Management',
      'Fundamentals of Financial Management'
    ],
    'Year 3': [
      'Business Law',
      'Foundation of Financial Systems',
      'Business Environment and Strategy',
      'Taxation in Nepal',
      'Fundamentals of Marketing'
    ],
    'Year 4': [
      'Entrepreneurship',
      'Concentration I',
      'Concentration II',
      'Concentration III',
      'Business Research Methods',
      'Final Project'
    ]
  },
  BSW: {
    'Year 1': [
      'Introduction to Social Work',
      'Basic Sociology for Social Work',
      'Academic English',
      'Compulsory Nepali',
      'Social Work Field Practicum & Skills Lab'
    ],
    'Year 2': [
      'Basic Psychology for Social Work',
      'Social Case Work Practice',
      'Social Work Practice with Groups',
      'Fieldwork, Observation Visits, and Skills Lab'
    ],
    'Year 3': [
      'Community Organization and Development',
      'Social Policy, Welfare Administration, and Human Rights',
      'Social Action and Leadership Development',
      'Rural/Urban Camp and Field Practicum'
    ],
    'Year 4': [
      'Social Problems, Identification, and Interventions',
      'Theoretical Ideologies of Social Work & Contemporary Issues',
      'Social Work Research and Academic Writing',
      'Research Dissertation/Report and Block Fieldwork Placement'
    ]
  },
  BICTE: {
    'Semester 1': [
      'English Language I',
      'General Nepali I',
      'Fundamentals of Education',
      'Mathematics I',
      'Introduction to Information Technology',
      'Programming Concept with C'
    ],
    'Semester 2': [
      'English Language II',
      'General Nepali II',
      'Developmental Psychology',
      'Mathematics II',
      'Digital Logic',
      'Object Oriented Programming with C++'
    ],
    'Semester 3': [
      'Learning Psychology',
      'Data Structure and Algorithm',
      'Computer Architecture and Organization',
      'Web Technology',
      'Probability and Statistics',
      '21st Century Life Skills'
    ],
    'Semester 4': [
      'Fundamentals of Curriculum',
      'Operating System',
      'Database Management System',
      'System Analysis and Design',
      'Numerical Analysis',
      'Leadership and Management'
    ],
    'Semester 5': [
      'Assessment in Teaching and Learning',
      'Java Programming Language',
      'Data Communication and Networks',
      'Software Engineering and Project Management',
      'Discrete Mathematics'
    ],
    'Semester 6': [
      'Research Methods in Education',
      'Visual Programming',
      'Computer Graphics',
      'Digital Pedagogy',
      'Network and Information Security'
    ],
    'Semester 7': [
      'Research Project',
      'Artificial Intelligence in Education',
      'Teaching Methods for ICT',
      'Geographical Information System',
      'Big Data Analysis'
    ],
    'Semester 8': [
      'Classroom Pedagogy',
      'System Administrator with Linux',
      'Python Programming',
      'Cloud Computing',
      'Multimedia Technology',
      'Teaching Practicum in ICT'
    ]
  }
};
