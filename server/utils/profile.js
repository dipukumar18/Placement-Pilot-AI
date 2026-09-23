export const buildUserProfile = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  education: user.education,
  skills: user.skills,
  targetRole: user.targetRole,
  profileCompleted: user.profileCompleted,
  readinessScore: user.readinessScore,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const isProfileComplete = (user) => {
  const education = user.education ?? {};

  return Boolean(
    user.fullName?.trim() &&
      education.college?.trim() &&
      education.degree?.trim() &&
      education.branch?.trim() &&
      Number.isInteger(education.graduationYear) &&
      user.skills?.length &&
      user.targetRole?.trim()
  );
};
