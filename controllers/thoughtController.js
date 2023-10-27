const { Thought, User } = require('../models');
const { ObjectId } = require("mongoose").Types
const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const ThoughtData = await Thought.find()


      res.json(ThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
 
  async getSingleThought(req, res) {
    try {
      const ThoughtData = await Thought.findOne({ _id: new ObjectId(req.params.thoughtId) });
console.log(ThoughtData)
      res.json(ThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
 
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);

      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      )

      res.json({ message: 'Thought successfully created!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    const thoughtData = await Thought.findOneAndUpdate({ _id: new ObjectId(req.params.thoughtId) }, { $set: req.body }, { runValidators: true, new: true });


    res.json(thoughtData);

    console.log(err);
    res.status(500).json(err);
  },
  // delete thought
  async deleteThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndRemove({ _id: new ObjectId(req.params.thoughtId) })

    

      // remove thought from a user's thoughts array
      const dbUserData = User.findOneAndUpdate(
        { thoughts: new ObjectId(req.params.thoughtId) },
        { $pull: { thoughts: new ObjectId(req.params.thoughtId) } },
        { new: true }
      );


      res.json({ message: 'Thought deleted.' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update thought by adding a reaction to reactions array
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: new ObjectId(req.params.thoughtId) },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );


      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //same as above, except removing a reaction from reaction array
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: new ObjectId(req.params.thoughtId) },
        { $pull: { reactions: { reactionId: new ObjectId (req.params.reactionId) } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;