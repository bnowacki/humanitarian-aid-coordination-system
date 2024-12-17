'use client';

import React, { useState } from 'react';

// Mock data
const mockReports = [
    { id: 1, title: 'Flood Report', description: 'Severe flooding in the northern region', date: '2023-12-15' },
    { id: 2, title: 'Earthquake Report', description: 'Magnitude 6.5 earthquake in the eastern region', date: '2023-12-10' },
];

const mockAidOrganizations = [
    { id: 1, name: 'Red Cross', contact: 'contact@redcross.org' },
    { id: 2, name: 'UNICEF', contact: 'contact@unicef.org' },
    { id: 3, name: 'Doctors Without Borders', contact: 'info@msf.org' },
];

// Type definitions
interface AidOrganization {
    id: number;
    name: string;
    contact: string;
}

interface CrisisEvent {
    id: number;
    name: string;
    description: string;
    assignedOrganizations: number[]; // Array of AidOrganization IDs
}

export default function AdminAidOrganizations() {
    const [crisisEvents, setCrisisEvents] = useState<CrisisEvent[]>([]);
    const [newEvent, setNewEvent] = useState<Pick<CrisisEvent, 'name' | 'description' | 'assignedOrganizations'>>({
        name: '',
        description: '',
        assignedOrganizations: [],
    });

    const handleCreateEvent = () => {
        if (newEvent.name && newEvent.description) {
            setCrisisEvents([...crisisEvents, { ...newEvent, id: Date.now() }]);
            setNewEvent({ name: '', description: '', assignedOrganizations: [] });
        }
    };

    const handleAssignOrganization = (eventId: number, organizationId: number) => {
        setCrisisEvents(crisisEvents.map(event =>
            event.id === eventId
                ? { ...event, assignedOrganizations: [...event.assignedOrganizations, organizationId] }
                : event
        ));
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Admin Panel: Aid Organizations</h1>

            {/* Section: Mock Reports */}
            <section style={{ marginBottom: '20px' }}>
                <h2>Mock Reports</h2>
                <ul>
                    {mockReports.map(report => (
                        <li key={report.id} style={{ marginBottom: '10px' }}>
                            <strong>{report.title}</strong> ({report.date})<br />
                            {report.description}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section: Create Crisis Event */}
            <section style={{ marginBottom: '20px' }}>
                <h2>Create Crisis Event</h2>
                <input
                    type="text"
                    placeholder="Event Name"
                    value={newEvent.name}
                    onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                    style={{ display: 'block', marginBottom: '10px' }}
                />
                <textarea
                    placeholder="Event Description"
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    style={{ display: 'block', marginBottom: '10px', width: '100%', height: '80px' }}
                />
                <button onClick={handleCreateEvent}>Create Event</button>
            </section>

            {/* Section: Crisis Events */}
            <section style={{ marginBottom: '20px' }}>
                <h2>Crisis Events</h2>
                {crisisEvents.length === 0 ? (
                    <p>No crisis events created yet.</p>
                ) : (
                    crisisEvents.map(event => (
                        <div key={event.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <h3>{event.name}</h3>
                            <p>{event.description}</p>
                            <h4>Assigned Organizations:</h4>
                            <ul>
                                {event.assignedOrganizations.length === 0 ? (
                                    <li>No organizations assigned yet.</li>
                                ) : (
                                    event.assignedOrganizations.map(orgId => {
                                        const org = mockAidOrganizations.find(o => o.id === orgId);
                                        return <li key={orgId}>{org?.name}</li>;
                                    })
                                )}
                            </ul>
                            <h4>Assign Organization:</h4>
                            <select
                                onChange={e => handleAssignOrganization(event.id, Number(e.target.value))}
                                defaultValue=""
                            >
                                <option value="" disabled>Select an organization</option>
                                {mockAidOrganizations.map(org => (
                                    <option key={org.id} value={org.id}>{org.name}</option>
                                ))}
                            </select>
                        </div>
                    ))
                )}
            </section>

            {/* Section: View Aid Organizations */}
            <section>
                <h2>View Aid Organizations</h2>
                <ul>
                    {mockAidOrganizations.map(org => (
                        <li key={org.id} style={{ marginBottom: '10px' }}>
                            <strong>{org.name}</strong><br />
                            Contact: {org.contact}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
