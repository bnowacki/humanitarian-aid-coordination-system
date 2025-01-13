import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function UploadPopUp({ resource, onSave, onCancel }: any) {
  const [name, setName] = useState(resource.name);
  const [quantity, setQuantity] = useState(resource.quantity);
  const [description, setDescription] = useState(resource.description);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ name, quantity: parseInt(quantity), description })
        .eq('id', resource.id);

      if (error) {
        console.error('Error updating resource:', error);
        alert('Error updating resource: ' + error.message);
      } else {
        onSave();
      }
    } catch (e) {
      console.error('Unexpected error updating resource:', e);
    }
  };

  return (
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
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
