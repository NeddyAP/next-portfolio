'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react'; // For delete icon

export interface Hobby {
  name: string;
  icon_name?: string;
}

interface EditHobbiesFormProps {
  currentHobbies: Hobby[] | null;
  onSave: (newHobbies: Hobby[]) => void;
  onCancel: () => void;
}

export default function EditHobbiesForm({ currentHobbies, onSave, onCancel }: EditHobbiesFormProps) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [newHobbyName, setNewHobbyName] = useState('');
  const [newHobbyIcon, setNewHobbyIcon] = useState('');

  useEffect(() => {
    if (currentHobbies && Array.isArray(currentHobbies)) {
      // Ensure objects have the 'name' property
      const validHobbies = currentHobbies.filter(
        (h) => typeof h === 'object' && h !== null && typeof h.name === 'string'
      );
      setHobbies(validHobbies);
    } else {
      setHobbies([]);
    }
  }, [currentHobbies]);

  const handleAddHobby = () => {
    const trimmedName = newHobbyName.trim();
    const trimmedIcon = newHobbyIcon.trim();
    if (trimmedName && !hobbies.some(hobby => hobby.name === trimmedName)) {
      const newHobbyToAdd: Hobby = { name: trimmedName };
      if (trimmedIcon) {
        newHobbyToAdd.icon_name = trimmedIcon;
      }
      setHobbies([...hobbies, newHobbyToAdd]);
      setNewHobbyName('');
      setNewHobbyIcon('');
    }
  };

  const handleRemoveHobby = (hobbyNameToRemove: string) => {
    setHobbies(hobbies.filter(hobby => hobby.name !== hobbyNameToRemove));
  };

  const handleSaveChanges = () => {
    onSave(hobbies);
  };

  return (
    <div className="space-y-4 p-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="newHobbyNameInput">Hobby Name</Label>
          <Input
            id="newHobbyNameInput"
            type="text"
            value={newHobbyName}
            onChange={(e) => setNewHobbyName(e.target.value)}
            placeholder="Enter hobby name (e.g., Music)"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="newHobbyIconInput">Icon Name (Optional)</Label>
          <Input
            id="newHobbyIconInput"
            type="text"
            value={newHobbyIcon}
            onChange={(e) => setNewHobbyIcon(e.target.value)}
            placeholder="Enter icon name (e.g., Music)"
            className="mt-1"
          />
        </div>
      </div>
      <Button 
        type="button" 
        onClick={handleAddHobby} 
        variant="outline" 
        className="w-full sm:w-auto"
        disabled={!newHobbyName.trim()}
      >
        Add Hobby
      </Button>

      {hobbies.length > 0 && (
        <div className="space-y-2">
          <Label>Current Hobbies:</Label>
          <ul className="space-y-1">
            {hobbies.map((hobby, index) => (
              <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <span className="font-medium">{hobby.name}</span>
                  {hobby.icon_name && <span className="text-xs text-muted-foreground ml-2">(Icon: {hobby.icon_name})</span>}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveHobby(hobby.name)}
                  aria-label={`Remove ${hobby.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {hobbies.length === 0 && <p className="text-sm text-muted-foreground">No hobbies added yet.</p>}


      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSaveChanges}>
          Save Hobbies
        </Button>
      </div>
    </div>
  );
}
