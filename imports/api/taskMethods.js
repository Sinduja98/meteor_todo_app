import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';
 
Meteor.methods({
'tasks.insert': async function (text, isChecked = false) { 
  check(text, String);
  check(isChecked, Boolean); // Ensure isChecked is a Boolean

  if (!this.userId) {
    throw new Meteor.Error('Not authorized.');
  }

  console.log('this.userId:', this.userId);
  console.log('text:', text);
  console.log('isChecked:', isChecked);

  await TasksCollection.insertAsync({
    text,
    createdAt: new Date(),
    userId: this.userId,
    isChecked, // Now explicitly storing isChecked
  });

  const tasks = await TasksCollection.find({}).fetchAsync();
  // console.log('All tasks after insert:', tasks);
},

  'tasks.remove'(taskId) {
    check(taskId, String);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    TasksCollection.removeAsync(taskId);
  },
 
  'tasks.setIsChecked': async function (taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);
 
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task =await TasksCollection.findOneAsync({ _id: taskId, userId: this.userId });

    console.log('task', task);

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }
 
    await TasksCollection.updateAsync(taskId, {
      $set: {
        isChecked
      }
    });
  }
});