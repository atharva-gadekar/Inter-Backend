import { Interests } from "../models/Interests.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
	.connect(process.env.CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.catch((error) => console.log(error.message));

const interests = [
	{
		name: "Web Development",
		relatedTags: [
			"ReactJS",
			"AngularJS",
			"VueJS",
			"NodeJS",
			"HTML CSS",
			"SASS",
			"Responsive Web Design",
			"Frontend Development",
			"Backend Development",
			"Django",
			"Ruby on Rails",
			"Javascript",
			"TypeScript",
			"REST APIs",
			"GraphQL",
		],
	},
	{
		name: "App Development",
		relatedTags: [
			"Android",
			"iOS",
			"Swift",
			"Kotlin",
			"React Native",
			"Flutter",
			"Xamarin",
			"Ionic",
			"Mobile Development",
			"Hybrid Apps",
			"Native Apps",
			"Firebase",
			"App Design",
			"AR/VR Development",
		],
	},
	{
		name: "Law",
		relatedTags: [
			"Criminal Law",
			"Civil Law",
			"Corporate Law",
			"Intellectual Property Law",
			"Family Law",
			"Immigration Law",
			"Environmental Law",
			"Human Rights Law",
			"Contract Law",
			"Bankruptcy Law",
			"Labour Law",
			"Tax Law",
			"Tort Law",
			"Real Estate Law",
		],
	},
	{
		name: "Education",
		relatedTags: [
			"Teaching",
			"Curriculum Development",
			"Instructional Design",
			"Educational Technology",
			"Online Education",
			"Assessment and Evaluation",
			"Special Education",
			"Higher Education",
			"Adult Education",
			"Education Policy",
		],
	},
	{
		name: "Doctor",
		relatedTags: [
			"Medicine",
			"Surgery",
			"Dentistry",
			"Psychiatry",
			"Pediatrics",
			"Cardiology",
			"Neurology",
			"Oncology",
			"Radiology",
			"Dermatology",
		],
	},
	{
		name: "Artificial Intelligence",
		relatedTags: [
			"Machine Learning",
			"Deep Learning",
			"Neural Networks",
			"Computer Vision",
			"Natural Language Processing",
			"Reinforcement Learning",
			"Artificial Neural Networks (ANN)",
			"Convolutional Neural Networks (CNN)",
			"Recurrent Neural Networks (RNN)",
			"Generative Adversarial Networks (GAN)",
			"Expert Systems",
			"Fuzzy Logic",
			"Speech Recognition",
			"Image Processing",
			"Robotics",
			"AI Ethics",
		],
	},
	{
		name: "Blockchain",
		relatedTags: [
			"Bitcoin",
			"Ethereum",
			"Cryptocurrency",
			"Smart Contracts",
			"Decentralized Applications (DApps)",
			"Solidity",
			"Web3.js",
			"Hyperledger Fabric",
			"NFTs (Non-Fungible Tokens)",
			"Metaverse",
		],
	},
	{
		name: "Marketing",
		relatedTags: [
			"Social Media Marketing",
			"Search Engine Optimization",
			"Content Marketing",
			"Email Marketing",
			"Affiliate Marketing",
			"Influencer Marketing",
			"Digital Marketing",
			"Marketing Analytics",
			"Brand Management",
			"Marketing Strategy",
			"Advertising",
			"Public Relations",
			"Event Marketing",
			"Market Research",
		],
	},
	{
		name: "Finance",
		relatedTags: [
			"Investing",
			"Personal Finance",
			"Corporate Finance",
			"Financial Planning",
			"Risk Management",
			"Accounting",
			"Financial Analysis",
			"Banking",
			"Insurance",
			"Venture Capital",
			"Private Equity",
			"Mergers and Acquisitions",
			"Financial Markets",
			"Cryptocurrencies",
		],
	},
	{
		name: "Accounting",
		relatedTags: [
			"Financial Accounting",
			"Managerial Accounting",
			"Auditing",
			"Taxation",
			"Bookkeeping",
			"Budgeting",
			"Financial Reporting",
			"Accounting Software",
			"Accounting Standards",
			"Forensic Accounting",
		],
	},
	{
		name: "Engineering",
		relatedTags: [
			"Mechanical Engineering",
			"Electrical Engineering",
			"Civil Engineering",
			"Chemical Engineering",
			"Computer Engineering",
			"Biomedical Engineering",
			"Aerospace Engineering",
			"Industrial Engineering",
			"Environmental Engineering",
			"Materials Engineering",
		],
	},
	{
		name: "Software Engineering",
		relatedTags: [
			"Agile Methodologies",
			"Object-Oriented Programming",
			"Design Patterns",
			"Test Driven Development",
			"Continuous Integration",
			"Continuous Deployment",
			"Microservices",
			"Software Architecture",
			"DevOps",
			"Cloud Computing",
			"Amazon Web Services",
			"Google Cloud Platform",
			"Microsoft Azure",
			"Scalability",
			"Performance Optimization",
		],
	},
	{
		name: "Data Science",
		relatedTags: [
			"Machine Learning",
			"Deep Learning",
			"Data Visualization",
			"Data Analysis",
			"Data Mining",
			"Natural Language Processing",
			"Big Data",
			"Statistical Analysis",
			"Python",
			"R Programming",
			"SQL",
			"Apache Spark",
			"TensorFlow",
			"Keras",
			"Tableau",
		],
	},
	{
		name: "Product Management",
		relatedTags: [
			"Agile Methodologies",
			"Lean Startup",
			"Product Strategy",
			"Market Research",
			"Customer Development",
			"User Experience Design",
			"User Interface Design",
			"Data Analytics",
			"Roadmapping",
			"Product Development",
			"Project Management",
			"Product Metrics",
			"Product Marketing",
			"A/B Testing",
		],
	},
	{
		name: "Cybersecurity",
		relatedTags: [
			"Penetration Testing",
			"Vulnerability Assessment",
			"Threat Intelligence",
			"Identity and Access Management",
			"Network Security",
			"Endpoint Security",
			"Cloud Security",
			"Security Operations",
			"Application Security",
			"Security Architecture",
			"Security Compliance",
			"Incident Response",
			"Security Awareness Training",
			"Security Audit",
		],
	},
	{
		name: "Journalism",
		relatedTags: [
			"News Writing",
			"Editing",
			"Reporting",
			"Investigative Journalism",
			"Broadcast Journalism",
			"Photojournalism",
			"Sports Journalism",
			"Business Journalism",
			"Ethics and Law",
			"Media Literacy",
		],
	},
	{
		name: "Architecture",
		relatedTags: [
			"Design",
			"Drawing",
			"Modeling",
			"Construction",
			"Sustainability",
			"Urban Planning",
			"Landscape Architecture",
			"Interior Design",
			"Historic Preservation",
			"Building Codes",
		],
	},
	{
		name: "Psychology",
		relatedTags: [
			"Clinical Psychology",
			"Counseling Psychology",
			"Developmental Psychology",
			"Social Psychology",
			"Cognitive Psychology",
			"Neuropsychology",
			"Forensic Psychology",
			"Health Psychology",
			"Organizational Psychology",
			"Psychological Testing",
		],
	},
	{
		name: "Management",
		relatedTags: [
			"Leadership",
			"Strategic Planning",
			"Project Management",
			"Operations Management",
			"Human Resource Management",
			"Change Management",
			"Conflict Management",
			"Quality Management",
			"Risk Management",
			"Business Communication",
		],
	},
	{
		name: "Nursing",
		relatedTags: [
			"Patient Care",
			"Clinical Skills",
			"Medication Administration",
			"Health Assessment",
			"Nursing Diagnosis",
			"Nursing Theory",
			"Evidence-Based Practice",
			"Nursing Education",
			"Nursing Research",
			"Nursing Ethics",
		],
	},
	{
		name: "Sports",
		relatedTags: [
			"Football",
			"Basketball",
			"Tennis",
			"Cricket",
			"Golf",
			"Hockey",
			"Rugby",
			"Baseball",
			"Volleyball",
		],
	},
	{
		name: "Travel",
		relatedTags: [
			"Backpacking",
			"Camping",
			"Cruises",
			"Luxury Travel",
			"Solo Travel",
			"Adventure Travel",
			"Road Trips",
			"Ecotourism",
		],
	},
	{
		name: "Music",
		relatedTags: [
			"Rock",
			"Pop",
			"Jazz",
			"Classical",
			"Hip Hop",
			"Country",
			"Reggae",
			"Metal",
			"Blues",
		],
	},
	{
		name: "Art",
		relatedTags: [
			"Painting",
			"Drawing",
			"Sculpture",
			"Photography",
			"Graphic Design",
			"Animation",
			"Street Art",
			"Calligraphy",
		],
	},
	{
		name: "Books",
		relatedTags: [
			"Fiction",
			"Non-fiction",
			"Fantasy",
			"Science Fiction",
			"Romance",
			"Thriller",
			"Mystery",
			"Horror",
		],
	},
	{
		name: "Food",
		relatedTags: [
			"Italian Cuisine",
			"Mexican Cuisine",
			"Japanese Cuisine",
			"Chinese Cuisine",
			"Indian Cuisine",
			"Mediterranean Cuisine",
			"Veganism",
			"Barbecue",
			"Seafood",
		],
	},
	{
		name: "Science",
		relatedTags: [
			"Biology",
			"Chemistry",
			"Physics",
			"Astronomy",
			"Earth Science",
			"Psychology",
			"Sociology",
			"Anthropology",
			"Neuroscience",
		],
	},
	{
		name: "Fashion",
		relatedTags: [
			"Streetwear",
			"Luxury Fashion",
			"Vintage Clothing",
			"Athleisure",
			"Sustainable Fashion",
			"Formal Wear",
			"Accessories",
			"Shoes",
			"Swimwear",
		],
	},
	{
		name: "Film",
		relatedTags: [
			"Action",
			"Comedy",
			"Drama",
			"Horror",
			"Romance",
			"Science Fiction",
			"Documentary",
			"Animation",
			"Thriller",
		],
	},
	{
		name: "Fitness",
		relatedTags: [
			"Weightlifting",
			"Yoga",
			"Running",
			"Crossfit",
			"Pilates",
			"Cycling",
			"High Intensity Interval Training",
			"Martial Arts",
			"Swimming",
		],
	},
];


async function seedInterests() {
	try {
		await Interests.insertMany(interests); // wait for the operation to complete
		console.log("Interests inserted successfully");
	} catch (err) {
		console.error(err);
	}
}

seedInterests();