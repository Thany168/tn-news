// lib/auth-store.ts
// Stores admin users in a JSON file (same pattern as your article store)
// Passwords are hashed with bcryptjs — never stored in plain text.

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: "superadmin" | "editor";
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

//  helpers

function readUsers(): AdminUser[] {
  if (!fs.existsSync(DB_PATH)) return [];
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users: AdminUser[]) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), "utf-8");
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

//  public API

export function getUsers(): Omit<AdminUser, "passwordHash">[] {
  return readUsers().map(({ passwordHash: _, ...u }) => u);
}

export async function createUser(
  username: string,
  password: string,
  role: AdminUser["role"] = "editor",
): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = readUsers();

  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "Username already exists." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.push({
    id: generateId(),
    username: username.trim(),
    passwordHash,
    role,
    createdAt: new Date().toISOString(),
  });
  writeUsers(users);
  return { ok: true };
}

export async function verifyUser(
  username: string,
  password: string,
): Promise<Omit<AdminUser, "passwordHash"> | null> {
  const users = readUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase(),
  );
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, error: "User not found." };

  const match = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!match) return { ok: false, error: "Current password is incorrect." };
  if (newPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  return { ok: true };
}

export async function adminResetPassword(
  userId: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, error: "User not found." };
  if (newPassword.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  writeUsers(users);
  return { ok: true };
}

export function deleteUser(
  userId: string,
): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const superadmins = users.filter((u) => u.role === "superadmin");
  const target = users.find((u) => u.id === userId);
  if (!target) return { ok: false, error: "User not found." };
  if (target.role === "superadmin" && superadmins.length === 1) {
    return { ok: false, error: "Cannot delete the last superadmin." };
  }
  writeUsers(users.filter((u) => u.id !== userId));
  return { ok: true };
}

// Run once on first boot — seeds a default superadmin if no users exist
export async function seedDefaultAdmin() {
  const users = readUsers();
  if (users.length === 0) {
    await createUser(
      process.env.DEFAULT_ADMIN_USERNAME || "admin",
      process.env.DEFAULT_ADMIN_PASSWORD || "admin123",
      "superadmin",
    );
    console.log(
      "[auth] No users found — seeded default admin. Change the password immediately!",
    );
  }
}
