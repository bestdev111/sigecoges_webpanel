const authRoles = {
  admin: ['admin'],
  groupadmin: ['admin', 'groupadmin'],
  staff: ['admin', 'groupadmin', 'staff'],
  onlyGuest: [],
};

export default authRoles;
