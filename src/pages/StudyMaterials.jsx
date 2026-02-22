import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, BookOpen, Download, Eye, Link2, Plus, X, UploadCloud, ThumbsUp } from 'lucide-react';

// Scraped JNTUH Data
const PDF_MATERIALS = [
  {
    "id": 1,
    "title": "Analog and Digital Electronics",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "730",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-analog-and-digital-electronics-notes.47856/"
  },
  {
    "id": 2,
    "title": "Applied Physics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1298",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-applied-physics-important-questions-unit-wise.28411/"
  },
  {
    "id": 3,
    "title": "Applied Physics [B.Tech R22]",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1009",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-applied-physics-notes-unit-wise.47777/"
  },
  {
    "id": 4,
    "title": "Automata Theory And Compiler Design",
    "year": "3rd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "668",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-automata-theory-and-compiler-design-atcd-notes-study-materials.49867/"
  },
  {
    "id": 5,
    "title": "Basic Electrical Engineering",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "673",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-basic-electrical-engineering-study-materials-notes.36369/"
  },
  {
    "id": 6,
    "title": "Business Economics and Financial Analysis",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1732",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-business-economics-and-financial-analysis-notes.48023/"
  },
  {
    "id": 7,
    "title": "Chemistry",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1515",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-chemistry-important-questions-mid-exams-bits.32927/"
  },
  {
    "id": 8,
    "title": "Cloud Computing",
    "year": "4th Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "734",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-cloud-computing-notes-study-material.48686/"
  },
  {
    "id": 9,
    "title": "CNC Technology",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1537",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-cnc-technology-unit-wise-study-materials-notes.32178/"
  },
  {
    "id": 10,
    "title": "Computer Aided Engineering Graphics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1005",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-computer-aided-engineering-graphics-study-material-notes.39442/"
  },
  {
    "id": 11,
    "title": "Computer Networks (CN)",
    "year": "3rd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "748",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-computer-networks-notes-study-materials.48453/"
  },
  {
    "id": 12,
    "title": "Computer Organization and Architecture (COA)",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "517",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-computer-organization-and-architecture-notes-study-materials.48451/"
  },
  {
    "id": 13,
    "title": "Computer Oriented Statistical Methods (COSM)",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "426",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-computer-oriented-statistical-methods-notes-r22-r18.47857/"
  },
  {
    "id": 14,
    "title": "Cryptography and Network Security",
    "year": "4th Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "730",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-r22-cryptography-and-network-security-study-material-and-important-questions.37777/"
  },
  {
    "id": 15,
    "title": "Database Management Systems (DBMS)",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1468",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-database-management-systems-notes-study-materials.48029/"
  },
  {
    "id": 16,
    "title": "Data Mining",
    "year": "4th Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "270",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-data-mining-study-material-important-questions.37784/"
  },
  {
    "id": 17,
    "title": "Data Structures",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "2059",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-data-structures-notes-unit-wise.47853/"
  },
  {
    "id": 18,
    "title": "Design and Analysis Of Algorithms (DAA)",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1009",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-design-and-analysis-of-algorithms-daa-notes-study-materials.48576/"
  },
  {
    "id": 19,
    "title": "DEVOPS",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "261",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-devops-notes-study-materials.57498/"
  },
  {
    "id": 20,
    "title": "Digital Electronics",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1314",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-digital-electronics-notes.47854/"
  },
  {
    "id": 21,
    "title": "Digital Logic Design",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "870",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-digital-logic-design-study-material.47855/"
  },
  {
    "id": 22,
    "title": "Discrete Mathematics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1840",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-discrete-mathematics-notes-study-materials.48024/"
  },
  {
    "id": 23,
    "title": "Electronic Circuit Analysis (ECA)",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "141",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-electronic-circuit-analysis-notes-study-material.51638/"
  },
  {
    "id": 24,
    "title": "Electronic Devices and Circuits",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1738",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-electronic-devices-and-circuits-notes-unit-wise.47780/"
  },
  {
    "id": 25,
    "title": "Electrical and Hybrid Vehicles",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "824",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-electrical-and-hybrid-vehicles-notes-study-material.50198/"
  },
  {
    "id": 26,
    "title": "Elements Of Computer Science and Engineering",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "423",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-elements-of-computer-science-and-engineering-notes-unit-wise.47775/"
  },
  {
    "id": 27,
    "title": "English For Skill Enhancement",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1863",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-english-for-skill-enhancement-notes-unit-wise.47778/"
  },
  {
    "id": 28,
    "title": "Engineering Chemistry",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1468",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-engineering-chemistry-notes-unit-wise.47774/"
  },
  {
    "id": 29,
    "title": "Engineering Graphics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "177",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-engineering-graphics-study-material-notes.36368/"
  },
  {
    "id": 30,
    "title": "Engineering Mechanics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1421",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-engineering-mechanics-study-materials-notes.36392/"
  },
  {
    "id": 31,
    "title": "Engineering Physics",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "161",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-engineering-physics-study-material-notes.36393/"
  },
  {
    "id": 32,
    "title": "Formal Languages and Automata Theory",
    "year": "3rd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1002",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-formal-languages-and-automata-theory-notes-study-materials.48450/"
  },
  {
    "id": 33,
    "title": "Fundamentals Of Management",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "177",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-fundamentals-of-management-study-materials-important-questions.33520/"
  },
  {
    "id": 34,
    "title": "Hydrology and Water Resources Engineering (HWRE)",
    "year": "3rd Year",
    "branch": "Civil",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1689",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-hydrology-and-water-resources-engineering-hwre-notes.48575/"
  },
  {
    "id": 35,
    "title": "Information Security",
    "year": "4th Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "396",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-information-security-study-material-notes.37810/"
  },
  {
    "id": 36,
    "title": "Internet of Things (IOT)",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1347",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-internet-of-things-iot-study-material-notes.37819/"
  },
  {
    "id": 37,
    "title": "Introduction To Embedded Systems (IES)",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1517",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-introduction-to-embedded-systems-study-materials-notes.49054/"
  },
  {
    "id": 38,
    "title": "Introduction To Artificial Intelligence",
    "year": "3rd Year",
    "branch": "AIML",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "510",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-introduction-to-artificial-intelligence-iai-notes-study-materials.49869/"
  },
  {
    "id": 39,
    "title": "Java Programming",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "531",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-java-programming-notes-study-materials.48030/"
  },
  {
    "id": 40,
    "title": "Machine Learning",
    "year": "3rd Year",
    "branch": "AIML",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "426",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-machine-learning-notes-study-material.49855/"
  },
  {
    "id": 41,
    "title": "Mathematics - I",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "217",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-mathematics-i-important-short-long-answer-questions-objective-bits-for-mid-exams.32925/"
  },
  {
    "id": 42,
    "title": "Mathematics - II",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "215",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-mathematics-ii-notes.32926/"
  },
  {
    "id": 43,
    "title": "Mathematical and Statistical Foundations",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1312",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-mathematical-and-statistical-foundations-notes-study-material.49890/"
  },
  {
    "id": 44,
    "title": "Matrices and Calculus",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "517",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-matrices-and-calculus-notes-unit-wise.47773/"
  },
  {
    "id": 45,
    "title": "Microwave and Optical Communications",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "510",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-microwave-and-optical-communications-short-and-long-important-questions.37829/"
  },
  {
    "id": 46,
    "title": "Object Oriented Programming Using C++",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "890",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-object-oriented-programming-using-c-notes.47876/"
  },
  {
    "id": 47,
    "title": "Object Oriented Programming Through Java",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "530",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-object-oriented-programming-through-java-notes-r22-r18.47875/"
  },
  {
    "id": 48,
    "title": "Operating Systems",
    "year": "2nd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "203",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-operating-systems-notes-study-materials.48028/"
  },
  {
    "id": 49,
    "title": "Ordinary Differential Equations and Vector Calculus",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "662",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-ordinary-differential-equations-and-vector-calculus-notes-unit-wise.47771/"
  },
  {
    "id": 50,
    "title": "Python Programming",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1351",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-python-programming-study-materials-and-important-questions.28250/"
  },
  {
    "id": 51,
    "title": "Programming for Problem Solving (PPS)",
    "year": "1st Year",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1940",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-programming-for-problem-solving-pps-study-materials-question-and-answers-solutions-to-previous-question-papers.28259/"
  },
  {
    "id": 52,
    "title": "Signals and Systems",
    "year": "2nd Year",
    "branch": "ECE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "592",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-signals-and-systems-notes-study-materials.48025/"
  },
  {
    "id": 53,
    "title": "Software Engineering",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1421",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-software-engineering-notes-study-materials.48038/"
  },
  {
    "id": 54,
    "title": "Structural Analysis - I",
    "year": "3rd Year",
    "branch": "Civil",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1674",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-structural-analysis-i-notes-study-materials.48452/"
  },
  {
    "id": 55,
    "title": "Structural Analysis II (SA- II )",
    "year": "3rd Year",
    "branch": "Civil",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "138",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r22-r18-structural-analysis-ii-sa-ii-notes-important-question-and-objective-bits.48574/"
  },
  {
    "id": 56,
    "title": "Web Programming",
    "year": "All",
    "branch": "All",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1424",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-web-programming-notes-study-material.49930/"
  },
  {
    "id": 57,
    "title": "Web Technologies (WT)",
    "year": "3rd Year",
    "branch": "CSE",
    "size": "External",
    "type": "Study Material",
    "author": "JNTUH Forum",
    "downloads": "1002",
    "url": "https://www.forum.universityupdates.in/threads/jntuh-b-tech-r18-web-technologies-notes-study-materials.48539/"
  }
];

const YEARS = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];
const BRANCHES = ['All Branches', 'CSE', 'ECE', 'Civil', 'Mech', 'AIML', 'AI-DS'];

const StudyMaterials = () => {
  const [materials, setMaterials] = useState(() =>
    PDF_MATERIALS.map(mat => ({ ...mat, upvotes: Math.floor(Math.random() * 80) + 12 }))
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [activeYear, setActiveYear] = useState('All Years');
  const [activeBranch, setActiveBranch] = useState('All Branches');

  // Viewer State
  const [activePdfViewer, setActivePdfViewer] = useState(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newUpload, setNewUpload] = useState({
    title: '',
    year: '1st Year',
    branch: 'CSE',
    url: ''
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newUpload.title || !newUpload.url) return;

    const createdMaterial = {
      id: Date.now(),
      title: newUpload.title,
      year: newUpload.year,
      branch: newUpload.branch,
      size: "Community",
      type: "PDF Document",
      author: "You (Community)",
      downloads: "0",
      url: newUpload.url,
      upvotes: 0,
      hasUpvoted: false
    };

    setMaterials([createdMaterial, ...materials]);
    setIsUploadModalOpen(false);
    setNewUpload({ title: '', year: '1st Year', branch: 'CSE', url: '' });
  };

  const toggleUpvote = (id) => {
    setMaterials(materials.map(mat => {
      if (mat.id === id) {
        return {
          ...mat,
          upvotes: mat.hasUpvoted ? mat.upvotes - 1 : mat.upvotes + 1,
          hasUpvoted: !mat.hasUpvoted
        };
      }
      return mat;
    }));
  };

  const filteredPdfs = materials.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = activeYear === 'All Years' || pdf.year === activeYear || pdf.year === 'All';
    const matchesBranch = activeBranch === 'All Branches' || pdf.branch === activeBranch || pdf.branch === 'All';
    return matchesSearch && matchesYear && matchesBranch;
  }).sort((a, b) => {
    // 1. Prioritize exact branch matches
    if (activeBranch !== 'All Branches') {
      const aExact = a.branch === activeBranch;
      const bExact = b.branch === activeBranch;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
    }

    // 2. Sort by year progression
    const yearWeight = { '1st Year': 1, '2nd Year': 2, '3rd Year': 3, '4th Year': 4, 'All': 5 };
    const aWeight = yearWeight[a.year] || 99;
    const bWeight = yearWeight[b.year] || 99;

    if (aWeight !== bWeight) return aWeight - bWeight;

    // 3. Sort alphabetically by title
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="w-full flex-grow flex flex-col py-12 px-6 fade-in container mx-auto max-w-7xl">

      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BookOpen className="text-primary" size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
          Study Materials <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">Vault</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Access comprehensive notes, textbooks, and previous year papers compiled from JNTUH Forum and student submissions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">

        {/* Sidebar / Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 card-glass p-6 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-6 text-white font-semibold text-lg border-b border-white/10 pb-4">
            <Filter size={20} className="text-primary" />
            <h2>Filters</h2>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-primary w-full flex items-center justify-center gap-2 text-sm mb-8"
          >
            <UploadCloud size={18} />
            Share Material
          </button>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select Year</h3>
            <div className="flex flex-wrap gap-2">
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`text-sm px-4 py-2 rounded-full transition-all font-medium ${activeYear === year
                    ? 'bg-primary text-black border-primary font-bold shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select Branch</h3>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map(branch => (
                <button
                  key={branch}
                  onClick={() => setActiveBranch(branch)}
                  className={`text-sm px-4 py-2 rounded-full transition-all font-medium ${activeBranch === branch
                    ? 'bg-primary text-black border-primary font-bold shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full flex flex-col min-h-[500px]">

          {/* Search Bar */}
          <div className="relative mb-6 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by subject, code, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 text-white rounded-2xl py-4 flex pl-14 pr-6 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder-gray-500 shadow-inner text-lg"
            />
          </div>

          <div className="mb-6 flex justify-between items-center text-sm text-gray-400 px-2 border-b border-white/5 pb-4">
            <span>Showing <strong className="text-white">{filteredPdfs.length}</strong> resources</span>
          </div>

          {/* List Output */}
          <div className="flex flex-col gap-4">
            {filteredPdfs.map(pdf => (
              <div key={pdf.id} className="card-glass p-5 hover:bg-white/[0.04] transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center group">

                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-colors">
                  <span className="font-bold text-xs">PDF</span>
                </div>

                <div className="flex-grow">
                  <h3 className="font-semibold text-white text-lg lg:text-xl mb-2 group-hover:text-primary transition-colors">{pdf.title}</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/5 text-gray-300 text-xs px-3 py-1 rounded-md border border-white/10">{pdf.year}</span>
                    <span className="bg-primary/20 text-emerald-400 border border-primary/20 text-xs font-bold px-3 py-1 rounded-md">{pdf.branch}</span>
                    <span className="bg-white/5 text-gray-300 text-xs px-3 py-1 rounded-md border border-white/10">{pdf.type}</span>
                  </div>
                </div>

                <div className="flex-shrink-0 flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleUpvote(pdf.id)}
                      className={`h-10 px-3 rounded-full border flex items-center gap-2 transition-all font-medium text-sm ${pdf.hasUpvoted
                        ? 'bg-primary/20 text-emerald-400 border-primary/30'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      title="Upvote Resource"
                    >
                      <ThumbsUp size={16} className={pdf.hasUpvoted ? "fill-emerald-400" : ""} />
                      {pdf.upvotes}
                    </button>
                    <button
                      onClick={() => setActivePdfViewer(pdf)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:scale-110 transition-all"
                      title="Open Resource"
                    >
                      <Eye size={18} />
                    </button>
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black hover:scale-110 transition-all"
                      title="Download"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Source: {pdf.author} • {pdf.downloads} views</span>
                </div>

              </div>
            ))}
          </div>

          {filteredPdfs.length === 0 && (
            <div className="card-glass p-16 text-center rounded-2xl border-dashed border-white/10 flex-grow flex flex-col items-center justify-center">
              <Search className="text-gray-600 mb-6" size={56} />
              <h3 className="text-2xl text-white font-semibold mb-3">No resources found</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">We couldn't find any JNTUH study materials matching your current filters.</p>
              <button
                className="btn-primary"
                onClick={() => { setSearchTerm(''); setActiveYear('All Years'); setActiveBranch('All Branches'); }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Upload Material Modal Overlay */}
      {isUploadModalOpen && createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="card-glass w-full max-w-lg bg-neutral-900 overflow-hidden flex flex-col shadow-2xl relative animate-[slide-up_0.3s_ease-out]">

            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <UploadCloud className="text-primary" /> Share Material
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Document Title <span className="text-primary">*</span></label>
                <input
                  type="text"
                  required
                  value={newUpload.title}
                  onChange={(e) => setNewUpload({ ...newUpload, title: e.target.value })}
                  placeholder="e.g. Operating Systems Notes Unit 1"
                  className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Year & Branch Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Academic Year</label>
                  <select
                    value={newUpload.year}
                    onChange={(e) => setNewUpload({ ...newUpload, year: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="All">All Years</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Branch</label>
                  <select
                    value={newUpload.branch}
                    onChange={(e) => setNewUpload({ ...newUpload, branch: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="Civil">Civil</option>
                    <option value="Mech">Mech</option>
                    <option value="AIML">AIML</option>
                    <option value="AI-DS">AI-DS</option>
                    <option value="All">All Branches</option>
                  </select>
                </div>
              </div>

              {/* Internal/External URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Resource URL <span className="text-primary">*</span></label>
                <input
                  type="url"
                  required
                  value={newUpload.url}
                  onChange={(e) => setNewUpload({ ...newUpload, url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-black/50 border border-white/10 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">Link to a PDF, Drive file, or forum post.</p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>, document.body
      )}

      {/* Simulated In-App PDF Viewer Modal */}
      {activePdfViewer && createPortal(
        <div className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-xl animate-[fade-in_0.2s_ease-out]">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-900 absolute top-0 w-full z-10 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex flex-col items-center justify-center text-primary border border-primary/20">
                <span className="font-bold text-[10px]">PDF</span>
              </div>
              <h3 className="font-semibold text-white truncate max-w-[200px] md:max-w-xl">{activePdfViewer.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <a href={activePdfViewer.url} target="_blank" rel="noopener noreferrer" className="btn-secondary py-2 px-4 text-sm hidden md:flex items-center gap-2">
                <Link2 size={16} /> Open externally
              </a>
              <button
                onClick={() => setActivePdfViewer(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-rose-500 hover:text-white flex items-center justify-center text-gray-400 transition-colors ml-2 border border-white/10 hover:border-rose-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Viewer Content */}
          <div className="flex-1 w-full h-full pt-[73px] flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            {/* Simulated PDF container */}
            <div className="w-full max-w-5xl h-full md:h-[95%] bg-neutral-200 rounded-t-xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden animate-[slide-up_0.3s_ease-out] border border-white/10">

              {/* Fake PDF Toolbar */}
              <div className="bg-neutral-800 text-gray-400 p-2 flex justify-between items-center text-xs px-6 border-b border-black">
                <span className="truncate max-w-[50%]">{activePdfViewer.title}.pdf</span>
                <span className="bg-black/50 px-3 py-1 rounded-full">Page 1 / 45</span>
              </div>

              {/* Fake Document Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 bg-white flex flex-col items-center">

                {/* Dummy Content Lines */}
                <div className="w-full max-w-3xl flex flex-col gap-6">
                  <div className="w-3/4 h-10 bg-neutral-200 rounded self-center mb-8"></div>
                  <div className="w-full h-3 bg-neutral-100 rounded"></div>
                  <div className="w-full h-3 bg-neutral-100 rounded"></div>
                  <div className="w-5/6 h-3 bg-neutral-100 rounded"></div>

                  <div className="w-full h-64 bg-neutral-50 rounded my-8 text-neutral-400 flex flex-col gap-2 items-center justify-center border-2 border-dashed border-neutral-200">
                    <BookOpen size={48} className="text-neutral-300 opacity-50" />
                    <span className="font-semibold text-lg text-neutral-400">Document Viewer</span>
                    <span className="text-sm">In a real application, an iframe or PDF.js would render {activePdfViewer.url} here.</span>
                  </div>

                  <div className="w-full h-3 bg-neutral-100 rounded"></div>
                  <div className="w-full h-3 bg-neutral-100 rounded"></div>
                  <div className="w-4/5 h-3 bg-neutral-100 rounded"></div>
                </div>

              </div>
            </div>
          </div>
        </div>, document.body
      )}

    </div>
  );
};

export default StudyMaterials;
