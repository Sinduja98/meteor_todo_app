import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Login.html';

Template.login.events({
  'submit .login-form'(e) {
    e.preventDefault();

    const target = e.target;
    const username = target.username.value;
    const password = target.password.value;

    console.log('Logging in with:', username, password);

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        console.error('Login failed:', error.reason);
        alert(error.reason);
      } else {
        console.log('Login successful!');
      }
    });
  },

  'click .register-button'(e) {
    e.preventDefault();

    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }

    Meteor.call('user.register', username, password, (error) => {
      if (error) {
        console.error('Registration failed:', error.reason);
        alert(error.reason);
      } else {
        console.log('Registration successful! Now logging in...');
        Meteor.loginWithPassword(username, password);
      }
    });
  }
});
