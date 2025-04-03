
import dataStore from './DataStore';
import { User } from '../types';

class AuthService {
  authenticateUser(pin: string): User | null {
    const users = dataStore.getUsers();
    return users.find(user => user.pin === pin) || null;
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
