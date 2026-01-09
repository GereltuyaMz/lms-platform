import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Layers, FileText, Users } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const supabase = await createClient();

  const [coursesResult, unitsResult, lessonsResult, enrollmentsResult] =
    await Promise.all([
      supabase.from("courses").select("id, is_published", { count: "exact" }),
      supabase.from("units").select("id", { count: "exact" }),
      supabase.from("lessons").select("id", { count: "exact" }),
      supabase.from("enrollments").select("id", { count: "exact" }),
    ]);

  const courses = coursesResult.data || [];
  const publishedCourses = courses.filter((c) => c.is_published).length;
  const draftCourses = courses.length - publishedCourses;

  return {
    totalCourses: courses.length,
    publishedCourses,
    draftCourses,
    totalUnits: unitsResult.count || 0,
    totalLessons: lessonsResult.count || 0,
    totalEnrollments: enrollmentsResult.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Нийт хичээл",
      value: stats.totalCourses,
      subtitle: `${stats.publishedCourses} нийтлэгдсэн, ${stats.draftCourses} ноорог`,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Нийт бүлэг",
      value: stats.totalUnits,
      subtitle: "Хичээлийн бүлгүүд",
      icon: Layers,
      href: "/admin/units",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Нийт сэдэв",
      value: stats.totalLessons,
      subtitle: "Видео, текст & тест",
      icon: FileText,
      href: "/admin/lessons",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Нийт бүртгэл",
      value: stats.totalEnrollments,
      subtitle: "Идэвхтэй суралцагчид",
      icon: Users,
      href: "#",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Хянах самбар</h1>
        <p className="text-gray-500 mt-1">LMS агуулгын ерөнхий мэдээлэл</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Түргэн үйлдлүүд
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/courses/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-50">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Шинэ хичээл үүсгэх</p>
                <p className="text-sm text-gray-500">Каталогт шинэ хичээл нэмэх</p>
              </div>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="p-2 rounded-lg bg-purple-50">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Ангилал удирдах</p>
                <p className="text-sm text-gray-500">Хичээлийн ангилалуудыг зохион байгуулах</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-900">
              Сүүлийн үйлдлүүд
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-sm">
              Үйлдлийн түүх энд харагдана...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
