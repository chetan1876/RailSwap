const express = require('express');
const router = express.Router();
const seatExchangeController = require('./seatExchange.controller');

// 1. New seat swap offer post karne aur matching engine run karne ke liye
router.post('/request', seatExchangeController.createRequest);

// 2. Kisi doosre user ki match hui request ko accept karne ke liye
router.post('/accept', seatExchangeController.acceptRequest);

// 3. Match hui request ko reject karne ke liye
router.post('/reject', seatExchangeController.rejectRequest);

// 4. User ki purani saari seat swaps ki history laane ke liye
router.get('/history', seatExchangeController.getHistory);

module.exports = router; // Express app ko handle dene ke liye sabse important line
