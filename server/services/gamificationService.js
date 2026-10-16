import User from "../models/User.js";
import GamificationEvent from "../models/GamificationEvent.js";

const timezone = process.env.GAMIFICATION_TIMEZONE || "UTC";

const dateKey = (date) => new Intl.DateTimeFormat("en-CA", {
  timeZone: timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date(date));

const previousDateKey = (key) => {
  const date = new Date(`${key}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
};

const buildBadges = ({ points, streak, evaluatedActivities }) => {
  const badges = [];
  if (evaluatedActivities >= 1) badges.push("first_evaluation");
  if (evaluatedActivities >= 10) badges.push("ten_evaluations");
  if (points >= 100) badges.push("100_points");
  if (streak >= 3) badges.push("three_day_streak");
  if (streak >= 7) badges.push("seven_day_streak");
  return badges;
};

export const awardActivity = async ({ userId, activityKey, type, occurredAt = new Date() }) => {
  const points = type === "mock_completed" ? 50 : 10;
  try {
    await GamificationEvent.create({ user: userId, activityKey, type, points, occurredAt });
  } catch (error) {
    if (error?.code === 11000) {
      return getGamificationSummary(userId);
    }
    throw error;
  }

  const events = await GamificationEvent.find({ user: userId }).select("occurredAt points").sort({ occurredAt: -1 }).lean();
  const activeDays = new Set(events.map((event) => dateKey(event.occurredAt)));
  const today = dateKey(occurredAt);
  let streak = 0;
  let cursor = today;
  while (activeDays.has(cursor)) {
    streak += 1;
    cursor = previousDateKey(cursor);
  }
  const totalPoints = events.reduce((sum, event) => sum + event.points, 0);
  const badges = buildBadges({ points: totalPoints, streak, evaluatedActivities: events.length });
  await User.findByIdAndUpdate(userId, { $set: { gamification: { points: totalPoints, badges, streak, lastActivityDate: today } } });
  return { points: totalPoints, badges, streak, lastActivityDate: today, evaluatedActivities: events.length };
};

export const getGamificationSummary = async (userId) => {
  const events = await GamificationEvent.find({ user: userId }).select("occurredAt points").sort({ occurredAt: -1 }).lean();
  const activeDays = new Set(events.map((event) => dateKey(event.occurredAt)));
  const lastActivityDate = events[0] ? dateKey(events[0].occurredAt) : null;
  let streak = 0;
  let cursor = lastActivityDate;
  while (cursor && activeDays.has(cursor)) {
    streak += 1;
    cursor = previousDateKey(cursor);
  }
  const points = events.reduce((sum, event) => sum + event.points, 0);
  return { points, badges: buildBadges({ points, streak, evaluatedActivities: events.length }), streak, lastActivityDate, evaluatedActivities: events.length };
};
