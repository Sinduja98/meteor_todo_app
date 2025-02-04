import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';

const insertTask = async (taskText) => await TasksCollection.insertAsync({ text: taskText });
 
Meteor.startup(async () => {
  const taskCount = await TasksCollection.find().countAsync();
  
  if (taskCount === 0) {
    await Promise.all([
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task'
    ].map(insertTask))
  }
});