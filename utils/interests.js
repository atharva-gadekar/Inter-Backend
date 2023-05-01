import Interests from '../models/interets.js';

// Insert initial interests and related tags
const interests = [
    {
        name: 'Technology',
        relatedTags: ['Artificial Intelligence', 'Blockchain', 'Cybersecurity', 'Data Science', 'Internet of Things']
    },
    {
        name: 'Sports',
        relatedTags: ['Football', 'Basketball', 'Tennis', 'Cricket', 'Golf']
    },
    {
        name: 'Travel',
        relatedTags: ['Backpacking', 'Camping', 'Cruises', 'Luxury Travel', 'Solo Travel']
    }
];

Interests.insertMany(interests)
    .then(() => {
        console.log('Interests inserted successfully');
    })
    .catch((err) => {
        console.error(err);
    });