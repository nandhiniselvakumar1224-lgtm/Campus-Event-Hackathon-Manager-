import React, { useEffect, useState } from 'react';
import {
  getEvents,
  createEvent,
  registerForEvent,
  getParticipants
} from './services/eventApi';
import './App.css';

function App() {
  console.log("App component loaded");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    maxParticipants: 50
  });

  const [student, setStudent] = useState({
    name: '',
    email: '',
    department: 'IT',
    teamName: '',
    teamMembers:''
  });

  // Load events from backend
  const loadEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
      setError('');
    } catch (err) {
      setError(
        err.message ||
        'Events load aagala. Backend and database check pannunga.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle event form changes
  const handleEventChange = (e) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle student form changes
  const handleStudentChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value
    });
  };

  // Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (!eventForm.date) {
        setError('Please select event date and time.');
        console.log("App component loaded")
        return;
      }

      const eventData = {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(),
        maxParticipants: Number(eventForm.maxParticipants)
      };

      await createEvent(eventData);

      setMessage('Event created successfully!');

      setEventForm({
        title: '',
        description: '',
        date: '',
        venue: '',
        maxParticipants: 50
      });

      await loadEvents();
    } catch (err) {
      setError(err.message || 'Event create failed.');
    }
  };

  // Register student for selected event
  const handleRegister = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      if (!selectedEvent?._id) {
        throw new Error('Please select an event first.');
      }

      const registrationData = {
        eventId: selectedEvent._id,
        name: student.name.trim(),
        email: student.email.trim().toLowerCase(),
        department: student.department,
        teamName: student.teamName.trim(),
        teamMembers:student.teamMembers.split(',').map(name => name.trim()).filter(name => name !== '')
      };

      const result = await registerForEvent(registrationData);

      setMessage(
         'Registration successful!'
      );
      setError('');

      setStudent({
        name: '',
        email: '',
        department: 'IT',
        teamName: ''
      });

      setSelectedEvent(null);
    } catch (err) {
      const errorMessage =
        err.message || 'Registration failed.';
        setError(errorMessage);
        alert('Registration Error:' + errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
const handleShowParticipants = async (eventId) => {
  try {
    setLoadingParticipants((prev) => ({
      ...prev,
      [eventId]: true
    }));

    const data = await getParticipants(eventId);

    setParticipants((prev) => ({
      ...prev,
      [eventId]: data
    }));
  } catch (error) {
    alert(error.message || 'Could not load participants');
  } finally {
    setLoadingParticipants((prev) => ({
      ...prev,
      [eventId]: false
    }));
  }
};
  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">
          CAMPUS LIFE • INNOVATION • TEAMWORK
        </p>
        <h1>Campus Event Hub</h1>
        <p>
          Discover events, join hackathons and build something amazing.
        </p>
      </header>

      <main className="container">

        {/* Create Event */}
        <section className="create-section">
          <h2>✨ Create an Event</h2>

          <form
            className="event-form"
            onSubmit={handleCreateEvent}
          >
            <input
              name="title"
              placeholder="Event title"
              value={eventForm.title}
              onChange={handleEventChange}
              required
            />

            <textarea
              name="description"
              placeholder="Event description"
              value={eventForm.description}
              onChange={handleEventChange}
              required
            />

            <label>Event date and time</label>
            <input
              type="datetime-local"
              name="date"
              value={eventForm.date}
              onChange={handleEventChange}
              required
            />

            <input
              name="venue"
              placeholder="Venue"
              value={eventForm.venue}
              onChange={handleEventChange}
              required
            />

            <label>Maximum participants</label>
            <input
              type="number"
              name="maxParticipants"
              min="1"
              value={eventForm.maxParticipants}
              onChange={handleEventChange}
              required
            />

            <button type="submit">
              Create Event
            </button>
          </form>
        </section>

        {/* Success and error messages */}
        {message && (
          <div className="success" role="status">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="message error" role="alert">
            ❌ {error}
          </div>
        )}

        {/* Events list */}
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT'S HAPPENING</p>
            <h2>Upcoming Events</h2>
          </div>

          <span className="event-count">
            {events.length} Events
          </span>
        </div>

        {loading && (
          <p className="message">Loading events...</p>
        )}

        {!loading && events.length === 0 && !error && (
          <div className="empty-state">
            <h3>No events yet</h3>
            <p>Create your first campus event above.</p>
          </div>
        )}

        <div className="event-grid">
          {events.map((event) => (
            <article
              className="event-card"
              key={event._id}
            >
              <div className="card-top">
                <span className="event-tag">
                  CAMPUS EVENT
                </span>
                <span className="event-icon">✦</span>
              </div>

              <h3>{event.title}</h3>
              <p>status: {event.status || 'Upcoming'}</p>

              <p className="description">
                {event.description}
              </p>

              <div className="event-info">
                <p>
                  📅 {new Date(event.date).toLocaleString()}
                </p>
                <p>📍 {event.venue}</p>
                <p>
                  👥 Up to {event.maxParticipants} participants
                </p>
              </div>

              <button
                type="button"
                className="register-button"
                onClick={() => {
                  setSelectedEvent(event);
                  setMessage('');
                  setError('');
                }}
              >
                Register Now
              </button>
              <button
  type="button"
  onClick={() => handleShowParticipants(event._id)}
  disabled={!!loadingParticipants[event._id]}
>
  {loadingParticipants[event._id]
    ? 'Loading...'
    : 'View Participants'}
</button>
{participants[event._id] && (
  <div className="participants-list">
    <h3>Registered Participants</h3>
    <p>
  Total Registered: {participants[event._id].length}
</p>

    {participants[event._id].length === 0 ? (
      <p>No participants registered yet.</p>
    ) : (
      participants[event._id].map((participant) => (
        <div key={participant._id}>
          <p>
            <strong>Name:</strong>{" "}
            {participant.studentId?.name || "Unknown"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {participant.studentId?.email || "N/A"}
          </p>
          <p>
            <strong>Department:</strong>{" "}
            {participant.studentId?.department || "N/A"}
          </p>
        </div>
      ))
    )}
  </div>
)}

              {/* Registration form */}
              {selectedEvent?._id === event._id && (
                <form
                  className="event-form registration-form"
                  onSubmit={handleRegister}
                >
                  <h3>Student Registration</h3>

                  <p>
                    Event: <strong>{event.title}</strong>
                  </p>

                  <input
                    name="name"
                    placeholder="Student name"
                    value={student.name}
                    onChange={handleStudentChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Student email"
                    value={student.email}
                    onChange={handleStudentChange}
                    required
                  />

                  <select
                    name="department"
                    value={student.department}
                    onChange={handleStudentChange}
                    required
                  >
                    <option value="IT">IT</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Other">Other</option>
                  </select>

                  <input
                    name="teamName"
                    placeholder="Team name (optional)"
                    value={student.teamName}
                    onChange={handleStudentChange}
                  />
                  <input
  name="teamMembers"
  placeholder="Team members (comma separated)"
  value={student.teamMembers || ''}
  onChange={handleStudentChange}
/>

                  <button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Registration'}
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setSelectedEvent(null)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </form>
              )}

            </article>
          ))}
      </div>
      </main>

      <footer>
        Campus Event Hub · Create. Connect. Innovate.
      </footer>
    </div>
  );
}

export default App;