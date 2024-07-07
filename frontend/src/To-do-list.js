import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const TodoList = () => {
    const [todo, setTodo] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    function create() {
        axios.post('http://localhost:5000/posting', { todo })
            .then(() => {
                alert('Data has been posted successfully');
                setTodo('');
                getData();
            })
            .catch(() => {
                alert('Failed to post data');
            });
    }

    function getData() {
        axios.get('http://localhost:5000/getting')
            .then((response) => {
                setTodos(response.data);
            })
            .catch(() => {
                alert('Failed to retrieve data');
            });
    }

    const updatedTodo = (id, updatedData) => {
        axios.put(`http://localhost:5000/updating/${id}`, { todo: updatedData })
            .then(() => {
                console.log('Todo updated successfully');
                getData();
            })
            .catch((error) => {
                console.error('Failed to update todo:', error);
                alert('Failed to update todo');
            });
    };

    const handleEditButtonClick = (id) => {
        const newdata = prompt("Enter the new data");

        if (newdata === null || newdata.trim() === '') {
            alert("Please enter valid new data");
            return;
        }

        updatedTodo(id, newdata.trim());
    };

    function deleteTodo(id) {
        axios.delete(`http://localhost:5000/deleting/${id}`)
            .then(() => {
                getData();
            })
            .catch(() => {
                alert("Failed to delete todo");
            });
    }

    return (
        <div style={{ background: 'linear-gradient(#78e7e8ww, #fdbb2d)', height: '100vh' }}>
            <ThemeProvider theme={theme}>
                <Typography variant="h1" sx={{ textAlign: 'center', padding: '40px', fontFamily: 'monospace', letterSpacing: '0.1cap', fontWeight: 'bold', fontSize: '3rem'}}>
                    Organize your Todo-List
                </Typography>
                <Box sx={{ padding: '80px 380px' }}>
                    <Stack direction="row" spacing={4} sx={{ marginBottom: '20px', marginTop: '50px', width: '820px' }}>
                        <TextField
                            id="todo"
                            label="Todo"
                            variant="outlined"
                            value={todo}
                            onChange={(e) => setTodo(e.target.value)}
                            fullWidth
                            sx={{ backgroundColor: 'white', height: '56px', boxShadow: '0px 0px 8px  rgb(104, 109, 118)' }}
                        />
                        <Button variant="contained" color="success" onClick={create}>Post</Button>
                        <Button variant="contained" onClick={getData}>Get All</Button>
                    </Stack>
                    <Stack spacing={2}>
                        {todos.map((item) => (
                            <Paper key={item._id} elevation={3} sx={{ padding: '10px', width: '800px', boxShadow: '0px 0px 8px rgb(104, 109, 118)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '800px' }}>
                                    <Typography variant="body1">{item.todo}</Typography>
                                    <Box>
                                        <Button
                                            variant="text"
                                            color="primary"
                                            onClick={() => handleEditButtonClick(item._id)}
                                            sx={{ marginRight: '10px' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="text"
                                            color="secondary"
                                            onClick={() => deleteTodo(item._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            </ThemeProvider>
        </div>
    );
};

export default TodoList;
