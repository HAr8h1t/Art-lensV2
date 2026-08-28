export const roles = {
  explorer: "explorer",
  creator: "creator",
  admin: "admin"
};

export function readDemoRole(request) {
  const role = request.headers["x-demo-role"] || roles.explorer;
  return Object.values(roles).includes(role) ? role : roles.explorer;
}

export function canModerate(role) {
  return role === roles.admin;
}

export function canCreateCulturalRecords(role) {
  return role === roles.creator || role === roles.admin;
}
