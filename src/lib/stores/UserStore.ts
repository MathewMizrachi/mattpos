
import { User } from '../types';
import { BaseStore } from './BaseStore';

class UserStore extends BaseStore<User> {
  constructor() {
    super();
    // Initialize with default users
    this.items = [
      { id: 1, name: 'Owner', pin: '1234', role: 'manager' },
      { id: 2, name: 'Staff 1', pin: '5678', role: 'staff' },
    ];
  }

  // Find a user by pin
  findByPin(pin: string): User | null {
    return this.items.find(user => user.pin === pin) || null;
  }

  // Add a new user
  add(user: Omit<User, 'id'>): User {
    const newUser = {
      ...user,
      id: this.items.length + 1
    };
    this.items.push(newUser);
    return newUser;
  }
}

// Create a singleton instance
const userStore = new UserStore();
export default userStore;
