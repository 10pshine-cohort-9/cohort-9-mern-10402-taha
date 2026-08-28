import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Since Babel transforms import.meta to process, we can just set process.env
process.env.VITE_API_URL = 'http://localhost:5000/api';

// Clear localStorage between tests
afterEach(() => {
  localStorage.clear();
});
