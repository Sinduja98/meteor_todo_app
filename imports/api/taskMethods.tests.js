import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { mockMethodCall } from 'meteor/quave:testing';
import { assert } from 'chai';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/taskMethods';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;

      beforeEach(async () => {
        TasksCollection.removeAsync({});
        taskId =await TasksCollection.insertAsync({
          text: 'Test Task',
          createdAt: new Date(),
          userId,
          isChecked: false,
        });
      });

      it('can delete owned task', async() => {
        mockMethodCall('tasks.remove', taskId, { context: { userId } });

        assert.equal(await TasksCollection.find().countAsync(), 0);
      });

      it(`can't delete task without an user authenticated`, async () => {
        const fn = () => mockMethodCall('tasks.remove', taskId);
        assert.throw(fn, /Not authorized/);
        assert.equal(await TasksCollection.find().countAsync(), 1);
      });
      
      it('can change the status of a task',async  () => {
        const originalTask = await TasksCollection.findOneAsync(taskId);
        console.log('originalTask', originalTask);
        await mockMethodCall('tasks.setIsChecked', taskId, !originalTask.isChecked, {
          context: { userId },
        });

        const updatedTask = await TasksCollection.findOneAsync(taskId);
        console.log('updatedTask', updatedTask.isChecked);
        assert.notEqual(updatedTask.isChecked, originalTask.isChecked);
      });

      it('can insert new tasks', async () => {
        const text = 'New Task';
        const isChecked = false;
        await mockMethodCall('tasks.insert', text, isChecked,{
          context: { userId },
        });

        const tasks = await TasksCollection.find({}).fetchAsync();
        assert.equal(tasks.length, 2);
        assert.isTrue(tasks.some(task => task.text === text));
      });
    });
  });
}