import { Button, Dialog, DialogContent,TextField, DialogActions } from "@mui/material";
import { useState } from "react";
export default function CreatePlaylistModal({ open, onClose, onCreate }) {
  // 1. Declare the state
  const [name, setName] = useState('');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <TextField
          label="Playlist Name"
          // 2. Bind the value to the state variable
          value={name} 
          // 3. Update the state as the user types
          onChange={(e) => setName(e.target.value)} 
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            // 4. Pass the final 'name' string to the parent function
            onCreate(name); 
            setName(''); // Clear it for next time
            onClose();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}