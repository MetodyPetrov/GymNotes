export async function registerUser(
  name: string,
  password: string,
  confirmPass: string
): Promise<void> {
  const response = await fetch('http://localhost:8080/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, password: password, confirmPassword: confirmPass, email: 'foncho@gmail.com' }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  const { accessToken } = await response.json() as { accessToken: string };
  localStorage.setItem('accessToken', accessToken);
} // put function await in authenticate/page.tsx

export async function loginUser(username: string, password: string): Promise<string> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error('Login failed');
  }
  
  const { accessToken } = (await res.json()) as { accessToken: string };
  return accessToken;
}
