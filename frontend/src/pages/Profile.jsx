import { Save } from "lucide-react";
import { useState } from "react";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const asList = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    skillsOffered: user?.skillsOffered?.join(", ") || "",
    skillsWanted: user?.skillsWanted?.join(", ") || ""
  });
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const response = await api.put("/users/me/profile", {
      name: form.name,
      bio: form.bio,
      skillsOffered: asList(form.skillsOffered),
      skillsWanted: asList(form.skillsWanted)
    });
    setUser(response.data.user);
    localStorage.setItem("skillswap_user", JSON.stringify(response.data.user));
    setMessage("Profile updated.");
  };

  return (
    <>
      <PageHeader title="Profile" description="Keep your teaching and learning interests visible to the community." />
      {message ? <p className="mb-4 rounded border border-mint/30 bg-mint/10 px-3 py-2 text-sm text-mint">{message}</p> : null}
      <form onSubmit={submit} className="grid gap-5 rounded border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label className="block text-sm font-medium">
          Skills offered
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.skillsOffered}
            onChange={(event) => setForm({ ...form, skillsOffered: event.target.value })}
            placeholder="React, public speaking"
          />
        </label>
        <label className="block text-sm font-medium">
          Skills wanted
          <input
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={form.skillsWanted}
            onChange={(event) => setForm({ ...form, skillsWanted: event.target.value })}
            placeholder="Photoshop, guitar"
          />
        </label>
        <label className="block text-sm font-medium lg:col-span-2">
          Bio
          <textarea
            className="focus-ring mt-1 w-full rounded border border-slate-300 px-3 py-2"
            rows="5"
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
        </label>
        <div className="lg:col-span-2">
          <button className="focus-ring flex items-center gap-2 rounded bg-mint px-4 py-2 font-semibold text-white">
            <Save size={18} />
            Save profile
          </button>
        </div>
      </form>
    </>
  );
};

export default Profile;
