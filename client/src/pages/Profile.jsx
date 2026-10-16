import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const initialForm = {
  fullName: "",
  email: "",
  college: "",
  degree: "",
  branch: "",
  graduationYear: "",
  skills: [],
  targetRole: "",
};

const degreeOptions = [
  "B.Tech",
  "B.E.",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "B.Com",
  "M.Com",
  "BBA",
  "MBA",
  "BA",
  "MA",
  "B.Des",
  "M.Des",
  "B.Arch",
  "M.Arch",
  "Diploma",
  "Ph.D.",
  "Other",
];

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

const jobRoleOptions = [
  "Software Development Engineer (SDE)",
  "Software Engineer",
  "Associate Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "MERN Stack Developer",
  "React.js Developer",
  "Next.js Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "C++ Developer",
  ".NET Developer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "Flutter Developer",
  "Data Analyst",
  "Business Analyst",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "Artificial Intelligence Engineer",
  "AI Application Developer",
  "Generative AI Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cybersecurity Analyst",
  "Information Security Engineer",
  "Network Engineer",
  "QA Engineer",
  "Software Test Engineer",
  "Automation Test Engineer",
  "Database Administrator",
  "UI/UX Designer",
  "Product Designer",
  "Product Manager",
  "Technical Product Manager",
  "Business Intelligence Analyst",
  "Embedded Systems Engineer",
  "Firmware Engineer",
  "Blockchain Developer",
  "Game Developer",
  "AR/VR Developer",
  "Technical Support Engineer",
  "IT Support Engineer",
  "System Administrator",
  "Solutions Architect",
  "Technical Consultant",
  "Technical Writer",
  "Research Engineer",
  "Competitive Programmer",
  "Other",
];


const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#070b17] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/10 [color-scheme:dark] [&>option]:bg-[#070b17] [&>option]:text-white";


function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [customTargetRole, setCustomTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isCustomRole =
    form.targetRole === "Other" ||
    (form.targetRole !== "" &&
      !jobRoleOptions.includes(form.targetRole));

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const result = await apiRequest("/profile");

        if (!active) return;

        const profile = result.data;
        const savedRole = profile.targetRole || "";
        const roleExists = jobRoleOptions.includes(savedRole);

        setForm({
          fullName: profile.fullName || "",
          email: profile.email || "",
          college: profile.education?.college || "",
          degree: profile.education?.degree || "",
          branch: profile.education?.branch || "",
          graduationYear: profile.education?.graduationYear
            ? String(profile.education.graduationYear)
            : "",
          skills: Array.isArray(profile.skills)
            ? profile.skills
            : [],
          targetRole: roleExists ? savedRole : savedRole ? "Other" : "",
        });

        setCustomTargetRole(roleExists ? "" : savedRole);
      } catch (err) {
        if (!active) return;

        setError(
          err.message || "Unable to load your profile. Please try again."
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

    loadProfile();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function addSkill(skillName) {
    const skill = skillName.trim();

    if (!skill) return;

    if (skill.length > 60) {
      setError("Skill names must not exceed 60 characters.");
      return;
    }

    const exists = form.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setError("This skill has already been added.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      skills: [...previous.skills, skill],
    }));

    setSkillInput("");
    setError("");
    setSuccess("");
  }

  function removeSkill(skillToRemove) {
    setForm((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      form.fullName.trim().length < 2 ||
      form.fullName.trim().length > 100
    ) {
      setError("Full name must be between 2 and 100 characters.");
      return;
    }

    if (
      !form.college.trim() ||
      !form.degree.trim() ||
      !form.branch.trim()
    ) {
      setError("Please complete all education details.");
      return;
    }

    const year = Number(form.graduationYear);

    if (
      !form.graduationYear ||
      !Number.isInteger(year) ||
      year < 1950 ||
      year > new Date().getFullYear() + 15
    ) {
      setError("Please enter a valid graduation year.");
      return;
    }

    if (form.skills.length === 0) {
      setError("Please add at least one technical skill.");
      return;
    }

    const finalTargetRole = (
      isCustomRole ? customTargetRole : form.targetRole
    ).trim();

    if (
      !finalTargetRole ||
      finalTargetRole === "Other" ||
      finalTargetRole.length > 100
    ) {
      setError(
        "Please select a target job role or enter a custom role."
      );
      return;
    }

    setSaving(true);

    try {
      const result = await apiRequest("/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          education: {
            college: form.college.trim(),
            degree: form.degree.trim(),
            branch: form.branch.trim(),
            graduationYear: year,
          },
          skills: form.skills,
          targetRole: finalTargetRole,
        }),
      });

      const profile = result.data;

      let storedUser = {};

      try {
        storedUser = JSON.parse(
          localStorage.getItem("user") || "{}"
        );
      } catch {
        storedUser = {};
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          fullName: profile.fullName,
          email: profile.email,
          role: profile.role,
          skills: profile.skills,
          targetRole: profile.targetRole,
          education: profile.education,
          profileCompleted: profile.profileCompleted,
          readinessScore: profile.readinessScore,
        })
      );

      const savedRole = profile.targetRole || "";
      const roleExists = jobRoleOptions.includes(savedRole);

      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        college: profile.education?.college || "",
        degree: profile.education?.degree || "",
        branch: profile.education?.branch || "",
        graduationYear: profile.education?.graduationYear
          ? String(profile.education.graduationYear)
          : "",
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        targetRole: roleExists ? savedRole : savedRole ? "Other" : "",
      });

      setCustomTargetRole(roleExists ? "" : savedRole);

      setSuccess(
        profile.profileCompleted
          ? "Your profile has been updated successfully."
          : "Your profile has been saved. Complete any remaining details to finish your profile."
      );
    } catch (err) {
      setError(
        err.message || "Unable to update your profile. Please try again."
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
              PERSONAL WORKSPACE
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Manage your personal information, education, technical
              skills, and career preferences. These details help
              personalize your placement preparation and learning roadmap.
            </p>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

       
{success && (
  <div
    role="status"
    aria-live="polite"
    className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-5 py-4 text-sm text-emerald-200 shadow-lg shadow-emerald-950/20"
  >
    <span className="text-xl" aria-hidden="true">
      ✓
    </span>
    <div>
      <p className="font-bold text-emerald-300">
        Profile Saved Successfully!
      </p>
      <p className="mt-1 leading-6">{success}</p>
    </div>
  </div>
)}


        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b1020] p-10 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
            <p className="mt-4 text-sm text-slate-400">
              Loading your profile...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                  STEP 01
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Personal Information
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Review and update your personal details.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </span>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    className={`${inputClass} [color-scheme:dark]`}
                    placeholder="Enter your full name"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    Email Address
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">
                      Read-only
                    </span>
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className={`${inputClass} cursor-not-allowed text-slate-400`}
                    placeholder="Loading registered email..."
                    autoComplete="email"
                  />
                  <span className="mt-2 block text-xs text-slate-500">
                    This is the email address associated with your
                    account. It cannot be changed from this page.
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
                  STEP 02
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Education Details
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Provide details about your current or completed education.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    College / University
                  </span>
                  <input
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    className={`${inputClass} [color-scheme:dark]`}
                    placeholder="Enter your college or university name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Degree
                  </span>
                  <select
                    name="degree"
                    value={form.degree}
                    onChange={handleChange}
                    required
                    className={`${inputClass} [color-scheme:dark]`}
                  >
                    <option value="">Select your degree</option>
                    {degreeOptions.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Branch / Specialization
                  </span>
                  <input
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                    maxLength={120}
                    className={`${inputClass} [color-scheme:dark]`}
                    placeholder="e.g., Computer Science and Engineering"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Graduation Year
                  </span>
                  <input
                    type="number"
                    name="graduationYear"
                    value={form.graduationYear}
                    onChange={handleChange}
                    min="1950"
                    max={new Date().getFullYear() + 15}
                    required
                    className={`${inputClass} [color-scheme:dark]`}
                    placeholder="e.g., 2027"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  STEP 03
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Technical Skills
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Select the technologies and skills you currently know.
                  You can also add skills that are not listed.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => {
                  const selected = form.skills.some(
                    (item) =>
                      item.toLowerCase() === skill.toLowerCase()
                  );

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          const existingSkill = form.skills.find(
                            (item) =>
                              item.toLowerCase() === skill.toLowerCase()
                          );

                          removeSkill(existingSkill);
                        } else {
                          addSkill(skill);
                        }
                      }}
                      className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
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

              <div className="mt-5 flex gap-2">
                <input
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                  maxLength={60}
                  className={`min-w-0 flex-1 ${inputClass}`}
                  placeholder="Enter another technical skill"
                  aria-label="Custom technical skill"
                />
                <button
                  type="button"
                  onClick={() => addSkill(skillInput)}
                  className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/20"
                >
                  Add Skill
                </button>
              </div>

              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <p className="mb-3 text-xs text-slate-500">
                  Selected Skills ({form.skills.length})
                </p>

                {form.skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
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
                    No skills selected yet.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0b1020] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                  STEP 04
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Career Preferences
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Select the job role you want to prepare for. Your
                  selection will help personalize your learning roadmap.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">
                  Target Job Role
                </span>
                <select
                  name="targetRole"
                  value={form.targetRole}
                  onChange={(event) => {
                    handleChange(event);
                    if (event.target.value !== "Other") {
                      setCustomTargetRole("");
                    }
                  }}
                  required
                  className={`${inputClass} [color-scheme:dark]`}
                >
                  <option value="">Select your target job role</option>
                  {jobRoleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role === "Other" ? "Other (Specify Below)" : role}
                    </option>
                  ))}
                </select>
              </label>

              {isCustomRole && (
                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-medium text-slate-300">
                    Specify Your Target Job Role
                  </span>
                  <input
                    value={customTargetRole}
                    onChange={(event) => {
                      setCustomTargetRole(event.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    required
                    maxLength={100}
                    className={`${inputClass} [color-scheme:dark]`}
                    placeholder="Enter your preferred job role"
                  />
                </label>
              )}
            </section>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/dashboard"
                className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-blue-950/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving Profile..." : "Save Profile →"}
              </button>
            </div>
          </form>
        )}

        <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Placement Pilot AI · Your Placement Assistant
        </footer>
      </main>
    </div>
  );
}

export default Profile;