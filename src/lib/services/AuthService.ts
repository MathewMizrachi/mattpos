
import userStore from '../stores/UserStore';
import { User } from '../types';

class AuthService {
  authenticateUser(pin: string): User | null {
    return userStore.findByPin(pin);
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
