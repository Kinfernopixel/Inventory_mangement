'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, IconButton, Grid, Paper, List, ListItem, ListItemText } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);

  const updateInventory = async () => {
    const snapshot = await getDocs(collection(firestore, 'inventory'));
    const inventoryList = [];
    snapshot.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const fetchRecipes = async () => {
    const ingredients = inventory.map(item => item.name).join(',');
    const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`);
    const data = await response.json();
    setRecipes(data);
    setShowRecipes(true);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCancelRecipes = () => {
    setShowRecipes(false);
    setRecipes([]);
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      position="relative"
    >
      <Image
        src="/image.png" // Ensure this path is correct
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        style={{ zIndex: -1, filter: 'brightness(1.1)' }} // Adjust brightness here
      />
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        gap={2}
        padding={4}
        position="absolute" // Ensure the content is layered above the background image
        top={0}
        left={0}
        bgcolor="rgba(255, 255, 255, 0.8)" // Optional: Add a semi-transparent background to improve readability
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%" 
            left="50%"
            width={400} 
            bgcolor="white"
            borderRadius={2}
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)'
            }}
          >
            <Typography variant="h6">Add item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }} 
              />
              <Button 
                variant="contained" 
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 4 }}>
          Add New Item
        </Button>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
          <Box 
            width="100%"
            bgcolor="#1976d2"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={2}
          >
            <Typography variant="h4">
              Inventory Items 
            </Typography>
          </Box>
          <Grid container spacing={2} padding={2}>
            {inventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} key={name}>
                <Paper elevation={2} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h5"> 
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6">
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton color="primary" onClick={() => addItem(name)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => removeItem(name)}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteItem(name)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
        <Button variant="contained" color="secondary" onClick={fetchRecipes} sx={{ mt: 4 }}>
          Get Recipes
        </Button>
        {showRecipes && (
          <Paper elevation={3} sx={{ width: '80%', padding: 2, marginTop: 4 }}>
            <Box 
              width="100%"
              bgcolor="#1976d2"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={2}
            >
              <Typography variant="h4">
                Recipe Suggestions
              </Typography>
            </Box>
            <List>
              {recipes.map((recipe) => (
                <ListItem key={recipe.id}>
                  <ListItemText 
                    primary={recipe.title} 
                    secondary={`Used Ingredients: ${recipe.usedIngredientCount}, Missing Ingredients: ${recipe.missedIngredientCount}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="contained" color="error" onClick={handleCancelRecipes} sx={{ mt: 2 }}>
              Cancel
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
