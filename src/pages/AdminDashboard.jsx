import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

import { Users, Dumbbell, Wallet, TrendingUp } from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardRes, membersRes] = await Promise.all([
        axiosInstance.get("/api/Dashboard"),
        axiosInstance.get("/api/Members"),
      ]);

      setDashboardData(dashboardRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Latest members
  const latestMembers = useMemo(() => {
    return [...members]
      .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
      .slice(0, 5);
  }, [members]);

  // Fake chart data from analytics
  const analyticsData = [
    {
      name: "Members",
      value: dashboardData?.activeMembers || 0,
    },
    {
      name: "Trainers",
      value: dashboardData?.activeTrainers || 0,
    },
    {
      name: "Revenue",
      value: dashboardData?.totalRevenue || 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <p className="text-lg text-red-400">{error}</p>

          <button
            onClick={fetchDashboardData}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

        <p className="mt-2 text-slate-400">
          Monitor your gym performance and analytics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {/* Active Members */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Members</p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {dashboardData?.activeMembers}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-green-400">
                <TrendingUp size={16} />
                <span className="text-sm">Gym activity is growing</span>
              </div>
            </div>

            <div className="rounded-2xl bg-blue-500/20 p-4">
              <Users className="text-blue-400" size={28} />
            </div>
          </div>
        </div>

        {/* Trainers */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Trainers</p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                {dashboardData?.activeTrainers}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-orange-400">
                <TrendingUp size={16} />
                <span className="text-sm">Trainers available today</span>
              </div>
            </div>

            <div className="rounded-2xl bg-orange-500/20 p-4">
              <Dumbbell className="text-orange-400" size={28} />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Revenue</p>

              <h2 className="mt-3 text-4xl font-bold text-white">
                ${dashboardData?.totalRevenue}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-emerald-400">
                <TrendingUp size={16} />
                <span className="text-sm">Revenue performance</span>
              </div>
            </div>

            <div className="rounded-2xl bg-emerald-500/20 p-4">
              <Wallet className="text-emerald-400" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Chart */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Gym Analytics</h2>

            <p className="mt-1 text-sm text-slate-400">
              Members, trainers, and revenue overview.
            </p>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />

                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                <XAxis dataKey="name" stroke="#94A3B8" />

                <YAxis stroke="#94A3B8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid #334155",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Members */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">New Members</h2>

            <p className="mt-1 text-sm text-slate-400">
              Recently joined members.
            </p>
          </div>

          <div className="space-y-4">
            {latestMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-lg font-bold text-white">
                  {member.fullName?.charAt(0)}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-white">
                    {member.fullName}
                  </h3>

                  <p className="truncate text-sm text-slate-400">
                    {member.email}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
