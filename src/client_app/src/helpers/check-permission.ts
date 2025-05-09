import { User } from "@/models/user";

export function CheckFeaturePermission(
  user: User | undefined,
  feature: string
): boolean {
  if (!user) return false;
  return user.actions.includes(feature);
}

export function CheckRolePermission(
  user: User | undefined,
  role: object
): boolean {
  if (!user) return false;
  const userActions = new Set(user.actions);
  return Object.keys(role).every((str) => userActions.has(str));
}
