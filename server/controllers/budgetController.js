const connectDB = require('../db');
const { ObjectId } = require('mongodb');

exports.getBudgets = async (req, res) => {
  const db = await connectDB();
  const budgets = await db.collection('budgets').find({ user_id: req.user.id }).toArray();
  res.json(budgets);
};

exports.createBudget = async (req, res) => {
  const db = await connectDB();
  const newBudget = {
    ...req.body,
    user_id: req.user.id,
    spent: 0,
    created_at: new Date(),
    updated_at: new Date(),
  };
  const result = await db.collection('budgets').insertOne(newBudget);
  res.json({ ...newBudget, id: result.insertedId });
};

exports.updateBudget = async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const updates = { ...req.body, updated_at: new Date() };
  const result = await db.collection('budgets').findOneAndUpdate(
    { _id: new ObjectId(id), user_id: req.user.id },
    { $set: updates },
    { returnDocument: 'after' }
  );
  if (!result.value) return res.status(404).json({ error: 'Budget not found' });
  res.json(result.value);
};

exports.deleteBudget = async (req, res) => {
  const db = await connectDB();
  const { id } = req.params;
  const result = await db.collection('budgets').deleteOne({ _id: new ObjectId(id), user_id: req.user.id });
  if (result.deletedCount === 0) return res.status(404).json({ error: 'Budget not found' });
  res.json({ success: true });
};
