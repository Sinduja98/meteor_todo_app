import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/taskMethods';
import '/imports/api/tasksPublications';

const insertTask = async (taskText, userId) => {
  try {
    console.log('Attempting to insert task:', taskText, 'for user:', userId);
    const taskId = await TasksCollection.insertAsync({
      text: taskText,
      userId, // Use userId directly instead of user._id
      createdAt: new Date(),
    });
    console.log('Task inserted successfully:', taskId);
    return taskId;
  } catch (error) {
    console.error('Error inserting task:', taskText, error);
    throw error;
  }
};

Meteor.startup(async () => {
  try {
    const taskCount = await TasksCollection.find().countAsync();
    console.log('Current task count:', taskCount);

    if (taskCount === 0) {
      console.log('Creating seed tasks...');
      const adminUser = await Accounts.findUserByUsername('admin');

      if (adminUser) {
        await Promise.all([
          'Build a rocket',
          'Write a book',
          'Find a treasure',
        ].map(taskText => insertTask(taskText, adminUser._id)));
        
        console.log('Seed tasks created successfully');
      } else {
        console.log('No admin user found. Skipping seed tasks.');
      }
    } else {
      console.log('Tasks already exist, skipping seed data');
    }
  } catch (error) {
    console.error('Error during startup:', error);
  }
});

