import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";

const Admin = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  const loadAdmin = async () => {
    const [analyticsResponse, usersResponse] = await Promise.all([api.get("/admin/analytics"), api.get("/admin/users")]);
    setAnalytics(analyticsResponse.data);
    setUsers(usersResponse.data);
  };

  useEffect(() => {
    loadAdmin();
  }, []);

  const toggleUser = async (user) => {
    await api.patch(`/admin/users/${user._id}/active`, { isActive: !user.isActive });
    loadAdmin();
  };

  return (
    <>
      <PageHeader title="Admin dashboard" description="Simple platform oversight for users, reports, and operating metrics." />
      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label="Users" value={analytics?.users ?? 0} tone="mint" />
        <StatCard label="Skills" value={analytics?.skills ?? 0} tone="coral" />
        <StatCard label="Bookings" value={analytics?.bookings ?? 0} tone="amber" />
        <StatCard label="Completed" value={analytics?.completedBookings ?? 0} tone="ink" />
        <StatCard label="Reported" value={analytics?.reportedUsers ?? 0} tone="coral" />
      </section>
      <section className="mt-6 overflow-hidden rounded border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Credits</th>
                <th className="px-4 py-3">Reports</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">{user.credits}</td>
                  <td className="px-4 py-3">{user.reports?.length || 0}</td>
                  <td className="px-4 py-3">{user.isActive ? "Active" : "Disabled"}</td>
                  <td className="px-4 py-3">
                    <button className="focus-ring rounded border border-slate-300 px-3 py-1" onClick={() => toggleUser(user)}>
                      {user.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Admin;
