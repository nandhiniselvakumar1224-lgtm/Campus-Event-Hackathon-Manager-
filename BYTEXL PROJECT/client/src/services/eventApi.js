const API_URL = '/api';

// Get all events
export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);

  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }

  return response.json();
};

// Create a new event
export const createEvent = async (eventData) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(eventData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create event');
  }

  return data;
};

// Get event by ID
export const getEventById = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch event details');
  }

  return response.json();
};

// Register for an event
// Register for an event
export const registerForEvent = async (registrationData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });

    const text = await response.text();

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error('Invalid response from server.');
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw error;
  }
};

// Get event participants
// Get participants for a specific event
export const getParticipants = async (eventId) => {
  const response = await fetch(
    `/api/participants/${eventId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || 'Failed to load participants'
    );
  }

  return data;
};