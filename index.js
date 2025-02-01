const express = require('express');
const app = express();
const cors = require('cors');



const contests = [
  {
    id: '1',
    title: 'Sample Problem',
    category: 'Programming',
    type: 'Challenge',
    problemStatement: 'Write a program to find the sum of prime numbers within a range.',
    constraint: 'Range',
    constraintValue: '1 to 100',
    material: 'None',
    startDate: '2025-01-10',
    startTime: '10:00:00',
    duration: '2 hours',
    access: 'Public',
    maxParticipants: 300,
    softwareRequired: 'Python 3.10',
    description: 'This problem tests basic understanding of loops and conditional statements.',
  },
  {
    id: '2',
    title: 'Circuit Design Task',
    category: 'Electronics',
    type: 'Project',
    problemStatement: 'Design a low-pass filter circuit with a cutoff frequency of 1 kHz.',
    constraint: 'Frequency',
    constraintValue: '1 kHz',
    material: 'Resistors, Capacitors',
    startDate: '2025-02-01',
    startTime: '14:00:00',
    duration: '3 hours',
    access: 'Private',
    maxParticipants: 50,
    softwareRequired: 'LTSpice',
    description: 'This project tests understanding of analog electronics and filter design.',
  },
  {
    id: '3',
    title: 'Circuit Design Task',
    category: 'Electronics',
    type: 'Project',
    problemStatement: 'Design a low-pass filter circuit with a cutoff frequency of 1 kHz.',
    constraint: 'Frequency',
    constraintValue: '1 kHz',
    material: 'Resistors, Capacitors',
    startDate: '2025-02-01',
    startTime: '14:00:00',
    duration: '3 hours',
    access: 'Private',
    maxParticipants: 50,
    softwareRequired: 'LTSpice',
    description: 'This project tests understanding of analog electronics and filter design.',
  },
  {
    id: '4',
    title: 'Circuit Design Task',
    category: 'Electronics',
    type: 'Project',
    problemStatement: 'Design a low-pass filter circuit with a cutoff frequency of 1 kHz.',
    constraint: 'Frequency',
    constraintValue: '1 kHz',
    material: 'Resistors, Capacitors',
    startDate: '2025-02-01',
    startTime: '14:00:00',
    duration: '3 hours',
    access: 'Private',
    maxParticipants: 50,
    softwareRequired: 'LTSpice',
    description: 'This project tests understanding of analog electronics and filter design.',
  },
  {
    id: '5',
    title: 'Circuit Design Task',
    category: 'Electronics',
    type: 'Project',
    problemStatement: 'Design a low-pass filter circuit with a cutoff frequency of 1 kHz.',
    constraint: 'Frequency',
    constraintValue: '1 kHz',
    material: 'Resistors, Capacitors',
    startDate: '2025-02-01',
    startTime: '14:00:00',
    duration: '3 hours',
    access: 'Private',
    maxParticipants: 50,
    softwareRequired: 'LTSpice',
    description: 'This project tests understanding of analog electronics and filter design.',
  },
  {
    id: '6',
    title: 'Circuit Design Task',
    category: 'Electronics',
    type: 'Project',
    problemStatement: 'Design a low-pass filter circuit with a cutoff frequency of 1 kHz.',
    constraint: 'Frequency',
    constraintValue: '1 kHz',
    material: 'Resistors, Capacitors',
    startDate: '2025-02-01',
    startTime: '14:00:00',
    duration: '3 hours',
    access: 'Private',
    maxParticipants: 50,
    softwareRequired: 'LTSpice',
    description: 'This project tests understanding of analog electronics and filter design.',
  },
];
app.use(cors());


app.get('/contest/:id', (req, res) => {
  const contest = contests.find(c => c.id === req.params.id);
  if (contest) {
    res.json(contest);
  } else {
    res.status(404).json({ message: 'Contest not found' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
