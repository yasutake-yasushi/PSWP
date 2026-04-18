const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:5000';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/api/users`);
  if (!res.ok) throw new Error('ユーザー取得に失敗しました');
  return res.json();
}

export async function createUser(user: Omit<User, 'id' | 'createdAt' | 'isActive'>): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('ユーザー作成に失敗しました');
  return res.json();
}

export async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('ユーザー更新に失敗しました');
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('ユーザー削除に失敗しました');
}
