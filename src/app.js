require('dotenv').config();
const express = require('express');
const axios = require('axios');
const redis = require('redis');

const app = express();
const client = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.connect();

app.get('/', (req, res) => {
    res.json('Ejemplo Redis Caching-NodeJs');
});

app.get('/users', (req, res) => {
    try {
        axios.get(`${process.env.API}`).then(response => {
            const users = response.data;
            console.log('Usuarios recolectados desde la API');
            res.status(200).send(users);
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get('/cached-users', async (req, res) => {
    try {
        const data = await client.get('users');

        if (data) {
            console.log('Usuarios recolectados desde Redis');
            res.status(200).send(JSON.parse(data));
        } else {
            axios.get(`${process.env.API}`).then(response => {
                const users = response.data;
                console.log('Usuarios recolectados desde la API');
                client.set('users', JSON.stringify(users))
                res.status(200).send(users);
            });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${process.env.PORT}`);
});