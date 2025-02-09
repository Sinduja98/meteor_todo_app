import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/db/TasksCollection';
import { Accounts } from 'meteor/accounts-base';
import '/imports/api/taskMethods';
import '/imports/api/tasksPublications';

const insertTask = async (taskText, user) => {
  try {
    console.log('Attempting to insert task:', taskText, 'for user:', user._id);
    const taskId = await TasksCollection.insertAsync({
      text: taskText,
      userId: user._id,
      createdAt: new Date(),
    });
    console.log('Task inserted successfully:', taskId);
    return taskId;
  } catch (error) {
    console.error('Error inserting task:', taskText, error);
    throw error;
  }
};
  // 
const SEED_USERNAME = 'kuna30';
const SEED_PASSWORD = 'test123';

Meteor.startup(async () => {
  try {
    // Check if user exists - need to await this
    const existingUser = await Accounts.findUserByUsername(SEED_USERNAME);
    console.log('Existing user check:', existingUser);
    
    if (!existingUser) {
      Accounts.createUser({
        username: SEED_USERNAME,
        password: SEED_PASSWORD,
      });
      console.log('Seed user created:', SEED_USERNAME);
    }
    
    // Get user data - need to await this too
    const user = await Accounts.findUserByUsername(SEED_USERNAME);
    console.log('Seed user found:', user);

    // Add explicit logging for task count
    const taskCount = await TasksCollection.find().countAsync();
    console.log('Current task count:', taskCount);

    if (taskCount === 0) {
      console.log('Creating seed tasks...');
      try {
        await Promise.all([
          'Build a rocket',
          'Write a book',
          'Find a treasure',
        ].map(taskText => insertTask(taskText, user)));
        console.log('Seed tasks created successfully');
        
        // Verify tasks were created
        const newTaskCount = await TasksCollection.find().countAsync();
        console.log('New task count:', newTaskCount);
      } catch (insertError) {
        console.error('Error inserting tasks:', insertError);
      }
    } 
    else {
      console.log('Tasks already exist, skipping seed data');
    }
  } catch (error) {
    console.error('Error during startup:', error);
  }
});

