const connectDB = require('../db');
const { ObjectId } = require('mongodb');

exports.getExpenses = async (req, res) => {
  const db = await connectDB();
  const expenses = await db.collection('expenses').find({ user_id: req.user.id }).toArray();
  res.json(expenses);
};

exports.createExpense = async (req, res) => {
  const db = await connectDB();
  const newExpense = {
    ...req.body,
    user_id: req.user.id,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const result = await db.collection('expenses').insertOne(newExpense);
  res.json({ ...newExpense, id: result.insertedId });
};

exports.updateExpense = async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date() };
  const result = await db.collection('expenses').findOneAndUpdate(
    { _id: new ObjectId(id), user_id: req.user.id },
    { $set: updates },
    { returnDocument: 'after' }
  );
  if (!result.value) return res.status(404).json({ error: 'Expense not found' });
  res.json(result.value);
};

exports.deleteExpense = async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const result = await db.collection('expenses').deleteOne({ _id: new ObjectId(id), user_id: req.user.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Expense not found' });
  res.json({ success: true });
};
