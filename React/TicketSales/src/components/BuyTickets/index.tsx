import React, { useState, useEffect } from 'react';

interface Event {
  eventname: string;
  totalTickets: number;
  availableTickets: number;
}

interface FormData {
  eventName: string;
  tickets: number;
  purchaser: string;
}

export default function BuyTickets() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    eventName: '',
    tickets: 1,
    purchaser: '',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:8000/events/all');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data: Event[] = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tickets' ? parseInt(value) || 0 : value,
    }));
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.eventName) {
      setError('Please select an event');
      return;
    }

    if (formData.tickets <= 0) {
      setError('Number of tickets must be greater than 0');
      return;
    }

    if (!formData.purchaser.trim()) {
      setError('Please enter your email');
      return;
    }

    try {
      setSubmitLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: formData.eventName,
          purchaser: formData.purchaser,
          tickets: formData.tickets,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to purchase tickets: ${response.statusText}`);
      }

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        eventName: '',
        tickets: 1,
        purchaser: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error purchasing tickets:', err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Buy Tickets</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Tickets purchased successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
            Select Event
          </label>
          <select
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select an event --</option>
            {events.map((event, index) => (
              <option key={index} value={event.eventname}>
                {event.eventname} ({event.availableTickets} available)
              </option>
            ))}
          </select>
          {formData.eventName && (
            <p className="mt-2 text-sm text-gray-500">
              {events.find(e => e.eventname === formData.eventName)?.availableTickets || 0} tickets available
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Tickets
          </label>
          <input
            type="number"
            id="tickets"
            name="tickets"
            min="1"
            value={formData.tickets}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="purchaser" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="purchaser"
            name="purchaser"
            value={formData.purchaser}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitLoading}
          className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {submitLoading ? 'Processing...' : 'Purchase Tickets'}
        </button>
      </form>

      {events.length === 0 && !loading && (
        <div className="mt-4 text-center text-gray-500">
          No events available at this time.
        </div>
      )}
    </div>
  );
}

