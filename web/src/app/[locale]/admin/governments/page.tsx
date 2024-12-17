'use client';

import ReportSaveButton from '@/components/report-save-button';
import React, { useState } from 'react';
import {
    Button,
    Box,
    Heading,
    Flex,
    List,
    Input,
    Strong,
    Text,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    Stack,
    createListCollection
} from '@chakra-ui/react';

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

export default function AdminGoverments() {
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

    const aidOrganizations = createListCollection({
        items: mockAidOrganizations.map((org) => ({
          label: org.name,
          value: String(org.id),
        })),
      });

    return (
        <Box minWidth={800} minHeight={600}>
            <Heading as='h1'>Government XYZ Panel</Heading>
            <br/><br/>
            <Flex w="full" gap={10} textAlign="center">
                {/* Section: Mock Reports */}
                <Box minWidth={400} minHeight={600}>
                    <Heading as='h2'>Mock Reports</Heading>
                    <List.Root>
                        {mockReports.map(report => (
                            <List.Item key={report.id} style={{ marginBottom: '10px' }}>
                                <Text><Strong>{report.title}</Strong> ({report.date})</Text>
                                <Text>{report.description}</Text>
                                <br/>
                                <ReportSaveButton/>
                            </List.Item>
                        ))}
                    </List.Root>
                </Box>

                {/* Section: Create Crisis Event */}
                <Box minWidth={400} minHeight={600}>
                    <Heading as='h2'>Create Crisis Event</Heading>
                    <Input
                        type="text"
                        placeholder="Event Name"
                        value={newEvent.name}
                        onChange={e => setNewEvent({ ...newEvent, name: e.target.value })}
                        style={{ display: 'block', marginBottom: '10px' }}
                    />
                    <Input
                        placeholder="Event Description"
                        value={newEvent.description}
                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        style={{ display: 'block', marginBottom: '10px', width: '100%', height: '80px' }}
                    />
                    <Button onClick={handleCreateEvent}>Create Event</Button>
                </Box>

                {/* Section: Crisis Events */}
                <Box minWidth={400} minHeight={600}>
                    <Heading as='h2'>Crisis Events</Heading>
                    {crisisEvents.length === 0 ? (
                        <Text>No crisis events created yet.</Text>
                    ) : (
                        crisisEvents.map(event => (
                            <Box key={event.id}>
                                <Heading as='h3'>{event.name}</Heading>
                                <Text>{event.description}</Text>

                                <SelectRoot
                                    collection={aidOrganizations}
                                    onValueChange={(value) => handleAssignOrganization(event.id, Number(value))}
                                >
                                    <SelectLabel>Assign Organization:</SelectLabel>
                                    <SelectTrigger>
                                    <SelectValueText placeholder="Select an organization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {aidOrganizations.items.map((org) => (
                                        <SelectItem key={org.value} item={org}>
                                        {org.label}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </SelectRoot>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Section: View Aid Organizations */}
                <Box minWidth={400} minHeight={600}>
                    <Heading as='h2'>View Aid Organizations</Heading>
                    <List.Root>
                        {mockAidOrganizations.map(org => (
                            <List.Item key={org.id} style={{ marginBottom: '10px' }}>
                                <Text><Strong>{org.name}</Strong></Text>
                                Contact: {org.contact}
                            </List.Item>
                        ))}
                    </List.Root>
                </Box>
         </Flex>
        </Box>
    );
}
