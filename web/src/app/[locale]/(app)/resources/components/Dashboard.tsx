'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import UploadPopUp from './UploadPopUp';

type Resource = {
    id: number;
    name: string;
    quantity: number;
    description: string;
  };
  
export default function Dashboard() {
    const [resources, setResources] = useState<Resource[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editResource, setEditResource] = useState(null);
  const [description, setDescription] = useState('');

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase.from('resources').select('*') as { data: Resource[] | null, error: any };
      if (error) {
        console.error('Error fetching resources:', error);
        alert('Error fetching resources: ' + error.message);
      } else if (data) {
        setResources(data);
      }
    } catch (e) {
      console.error('Unexpected error fetching resources:', e);
    }
  };

  const addResource = async () => {
    if (!name || !quantity || !description) {
      alert('Please fill in all fields: Resource Name, Quantity, and Description');
      return;
    }

    try {
      const { error } = await supabase
        .from('resources')
        .insert([{ name, quantity: parseInt(quantity), description }]);

      if (error) {
        console.error('Error adding resource:', error);
        alert('Error adding resource: ' + error.message);
      } else {
        fetchResources();
        setName('');
        setQuantity('');
        setDescription('');
        alert('Resource added successfully!');
      }
    } catch (e) {
      console.error('Unexpected error adding resource:', e);
    }
  };

  const deleteResource = async (id: number) => {
    const { error } = await supabase.from('resources').delete().eq('id', id);
    if (error) {
      console.error('Error deleting resource:', error);
      alert('Error deleting resource: ' + error.message);
    } else {
      fetchResources();
    }
  };

  const handleEdit = (resource: any) => {
    setEditResource(resource);
  };

  const handleSave = () => {
    setEditResource(null);
    fetchResources();
  };

  const handleCancel = () => {
    setEditResource(null);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <main>
      <h1>Resource Management Dashboard</h1>
      {editResource ? (
        <UploadPopUp
          resource={editResource}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div>
          <input
            type="text"
            placeholder="Resource Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={addResource}>Add</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource: any) => (
            <tr key={resource.id}>
              <td>{resource.name}</td>
              <td>{resource.quantity}</td>
              <td>{resource.description}</td>
              <td>
                <button onClick={() => handleEdit(resource)}>Edit</button>
                <button onClick={() => deleteResource(resource.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
