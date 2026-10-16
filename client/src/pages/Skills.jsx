
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const skillOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "DSA",
  "Git",
  "GitHub",
  "REST APIs",
  "Machine Learning",
  "Data Analysis",
  "AWS",
  "Docker",
  "Linux",
  "Figma",
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#070b17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10";

function Skills() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState("");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSkills() {
      try {
        const result = await apiRequest("/profile");
        if (!active) return;

        const data = result.data;

        setProfile(data);
        setSkills(
          Array.isArray(data.skills) ? data.skills : []
        );
      } catch (err) {
        if (!active) return;

        setError(
          err.message || "Unable to load your skills. Please try again."
        );

        const message = err.message?.toLowerCase() || "";

        if (
          message.includes("token") ||
          message.includes("unauthorized")
        ) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSkills();

    return () => {
      active = false;
    };
  }, [navigate]);

  function addSkill(skillName) {
    const skill = skillName.trim();

    if (!skill) {
      setError("Please enter a skill name.");
      return;
    }

    if (skill.length > 60) {
      setError("Skill names must not exceed 60 characters.");
      return;
    }

    const alreadyExists = skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setSkills((previous) => [...previous, skill]);
    setCustomSkill("");
    setError("");
    setSuccess("");
  }

  function removeSkill(skillToRemove) {
    setSkills((previous) =>
      previous.filter((skill) => skill !== skillToRemove)
    );

    setError("");
    setSuccess("");
  }

  async function saveSkills() {
    setError("");
    setSuccess("");

    if (!profile) {
      setError("Your profile is not loaded. Please refresh the page.");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one technical skill.");
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: profile.fullName,
          education: {
            college: profile.education?.college || "",
            degree: profile.education?.degree || "",
            branch: profile.education?.branch || "",
            graduationYear: profile.education?.graduationYear,
          },
          skills,
          targetRole: profile.targetRole || "",
        }),
      });

      const savedProfile = result.data;

      setProfile(savedProfile);
      setSkills(
        Array.isArray(savedProfile.skills)
          ? savedProfile.skills
          : skills
      );

      try {
        const storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            fullName: savedProfile.fullName,
            email: savedProfile.email,
            role: savedProfile.role,
            skills: savedProfile.skills,
            targetRole: savedProfile.targetRole,
            education: savedProfile.education,
            profileCompleted: savedProfile.profileCompleted,
            readinessScore: savedProfile.readinessScore,
          })
        );
      } catch {
        // The profile is already saved by the backend.
      }

      setSuccess("Your technical skills have been saved successfully.");
    } catch (err) {
      setError(
        err.message || "Unable to save your skills. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-black">
              P
            </div>

            <div>
              <p className="text-sm font-bold">
                Placement <span className="text-blue-400">Pilot AI</span>
              </p>
              <p className="mt-1 text-[9px] tracking-[0.16em] text-slate-500">
                YOUR PLACEMENT ASSISTANT
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.05]"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#101b38] via-[#11132c] to-[#15102c] p-6 sm:p-9">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[90px]" />

          <div className="relative">
            <span className="inline-flex rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs text-blue-300">
              SKILLS WORKSPACE
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              My Technical Skills
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Manage the skills you already know. Your saved skills will
              help personalize your learning roadmap and placement
              preparation.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3">
              <span className="text-2xl font-bold text-blue-300">
                {skills.length}
              </span>
              <span className="text-sm text-slate-400">
                Skills selected
              </span>
            </div>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-5 py-4 text-sm text-red-300"
          >
            <span className="mr-2">⚠</span>
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-4 text-sm text-emerald-200 shadow-lg shadow-emerald-950/20"
          >
            <span className="text-xl" aria-hidden="true">✓</span>
            <div>
              <p className="font-bold text-emerald-300">
                Skills Saved Successfully!
              </p>
              <p className="mt-1 leading-6">{success}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading your skills...
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <h2 className="text-xl font-bold">Choose Your Skills</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Select all the technologies and skills you know. Select
                a highlighted skill again to remove it.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {skillOptions.map((skill) => {
                  const selected = skills.some(
                    (item) =>
                      item.toLowerCase() === skill.toLowerCase()
                  );

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() =>
                        selected
                          ? removeSkill(
                              skills.find(
                                (item) =>
                                  item.toLowerCase() ===
                                  skill.toLowerCase()
                              )
                            )
                          : addSkill(skill)
                      }
                      className={`rounded-full border px-3.5 py-2.5 text-xs font-medium transition ${
                        selected
                          ? "border-blue-400/40 bg-blue-500/15 text-blue-200"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-blue-400/30 hover:text-white"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <h2 className="text-xl font-bold">Add a Custom Skill</h2>
              <p className="mt-2 text-sm text-slate-400">
                Cannot find your skill in the list? Add it here.
              </p>

              <form
                className="mt-5 flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  addSkill(customSkill);
                }}
              >
                <input
                  value={customSkill}
                  onChange={(event) => setCustomSkill(event.target.value)}
                  maxLength={60}
                  className={`min-w-0 flex-1 ${inputClass}`}
                  placeholder="e.g., Spring Boot, Kotlin, Power BI"
                  aria-label="Custom technical skill"
                />

                <button
                  type="submit"
                  className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                >
                  + Add Skill
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">Selected Skills</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    These skills will be saved to your student profile.
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs text-emerald-300">
                  {skills.length} selected
                </span>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-5">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-500/[0.07] px-3 py-2 text-xs text-emerald-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="text-emerald-200/60 hover:text-white"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills selected yet. Choose at least one skill
                    before saving.
                  </p>
                )}
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/profile"
                className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04]"
              >
                Edit Profile
              </Link>

              <button
                type="button"
                onClick={saveSkills}
                disabled={saving || loading}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Skills..." : "Save Skills →"}
              </button>
            </div>
          </div>
        )}

        <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Placement Pilot AI · Your Placement Assistant
        </footer>
      </main>
    </div>
  );
}

export default Skills;
