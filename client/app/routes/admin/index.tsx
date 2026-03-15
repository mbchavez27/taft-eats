import { Building, Star, User } from "lucide-react";
import type { ComponentType } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "~/components/ui/chart";
import { establishments } from "~/features/admin/data/establishments";
import { reviews } from "~/features/admin/data/reviews";
import { users } from "~/features/admin/data/users";

export function meta() {
  return [
    { title: "Taft Eats: Admin Dashboard" },
    { name: "description", content: "Admin dashboard for Taft Eats" },
  ];
}

const dailyReviewData = [
  { day: "Mon", reviews: 24 },
  { day: "Tue", reviews: 18 },
  { day: "Wed", reviews: 13 },
  { day: "Thu", reviews: 22 },
  { day: "Fri", reviews: 26 },
  { day: "Sat", reviews: 21 },
  { day: "Sun", reviews: 29 },
];

const getTopEstablishments = () => {
  return [...establishments]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
};

export default function AdminDashboardPage() {
  const totalUsers = users.length;
  const totalEstablishments = establishments.length;
  const totalReviews = reviews.length;

  const topEstablishments = getTopEstablishments();

  return (
    <div className="p-8 w-full">
      <div className="grid gap-6 lg:grid-cols-2">
        <Link
          to="/admin/reviews"
          className="block rounded-xl hover:shadow-lg transition-shadow"
        >
          <Card>
            <CardHeader>
              <CardTitle>Daily Reviews</CardTitle>
            </CardHeader>
            <CardContent className="h-60">
              <ChartContainer
                className="h-full aspect-auto"
                config={{ reviews: { color: "#22c55e" } }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyReviewData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    barCategoryGap="20%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="reviews"
                      fill="#22c55e"
                      radius={[8, 8, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/admin/users"
              className="block rounded-lg hover:bg-slate-50 transition-colors"
            >
              <StatCard icon={User} label="Users" value={totalUsers} />
            </Link>
            <Link
              to="/admin/establishments"
              className="block rounded-lg hover:bg-slate-50 transition-colors"
            >
              <StatCard
                icon={Building}
                label="Establishments"
                value={totalEstablishments}
              />
            </Link>
            <Link
              to="/admin/reviews"
              className="block rounded-lg hover:bg-slate-50 transition-colors"
            >
              <StatCard icon={Star} label="Reviews" value={totalReviews} />
            </Link>
          </CardContent>
        </Card>

        <Link
          to="/admin/establishments"
          className="block rounded-xl hover:shadow-lg transition-shadow lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Establishments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topEstablishments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                      <span className="font-semibold text-green-700">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">{item.cuisine}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {Math.round((reviews.length / totalEstablishments) * 10)}
                      </div>
                      <div className="text-xs text-slate-500">Reviews</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-slate-900">
                        {item.rating.toFixed(1)}
                      </span>
                      <span className="text-amber-400">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white px-4 py-6 text-center shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
