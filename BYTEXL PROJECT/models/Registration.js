const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
{
eventId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Event',
required: true
},
studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
teamName: {
type: String,
default: ''
},
teamMembers: {
type: [String],
default: []
},
status: {
type: String,
enum: ['Registered', 'Cancelled'],
default: 'Registered'
}
},
{ timestamps: true }
);

registrationSchema.index(
{ eventId: 1, studentId: 1 },
{ unique: true }
);

module.exports = mongoose.model('Registration', registrationSchema);