const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// සාම්පල database array එකක් (හෝ SQLite/MongoDB database query එකක්)
let orders = [];

// 1. Order එකක් ලබාගැනීම (Index / Order Page එකෙන් යවන විට)
app.post('/api/orders', (req, res) => {
    const newOrder = {
        id: Date.now(),
        name: req.body.name,
        phone: req.body.phone,
        time: req.body.time,
        methord: req.body.methord,
        grade: req.body.grade,
        foods: req.body.foods,
        totalCash: req.body.totalCash || 'LKR 0.00',
        status: 'Pending',
        orderDateOnly: new Date().toISOString().split('T')[0],
        date: new Date().toLocaleString()
    };
    orders.push(newOrder);
    res.json({ success: true, message: 'Order received successfully!', order: newOrder });
});

// 2. සියලුම Orders ලබාගැනීම (Admin Panel එකට)
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// 3. Order එකක් Completed ලෙස Update කිරීම (Admin Panel එකෙන්)
app.put('/api/orders/:id/complete', (req, res) => {
    const orderId = parseInt(req.params.id);
    orders = orders.map(order => {
        if (order.id === orderId) {
            order.status = 'Completed';
        }
        return order;
    });
    res.json({ success: true, orders });
});

// 4. Order එකක් Delete කිරීම (Admin Panel එකෙන්)
app.delete('/api/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    orders = orders.filter(order => order.id !== orderId);
    res.json({ success: true });
});

// 5. සියලුම Orders ඉවත් කිරීම (Clear All)
app.delete('/api/orders', (req, res) => {
    orders = [];
    res.json({ success: true });
});

app.listen(5000, () => console.log('Server running on port 5000'));