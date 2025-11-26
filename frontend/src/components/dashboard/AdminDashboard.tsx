import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, BookOpen, FolderOpen, Plus, TrendingUp } from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE_URL; // change to your backend URL

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalResources: number;
  totalCategories: number;
  totalViews: number;
  totalDownloads: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))'
];

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalResources: 0,
    totalCategories: 0,
    totalViews: 0,
    totalDownloads: 0,
  });

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
    fetchCategoryData();
    fetchActivityData();
  }, []);

  // -------------------------
  // FETCH ADMIN STATISTICS
  // -------------------------
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed fetching stats:", error);
    }
  };

  // -------------------------
  // FETCH CATEGORY PIE CHART DATA
  // -------------------------
  const fetchCategoryData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categories = await res.json();

      const categoryStats = await Promise.all(
        categories.map(async (category: any) => {
          const res = await fetch(`${API_BASE}/resources/byCategory/${category._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { count } = await res.json();

          return {
            name: category.name,
            value: count || 0,
          };
        })
      );

      setCategoryData(categoryStats);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  // -------------------------
  // FETCH RECENT RESOURCE ACTIVITY
  // -------------------------
  const fetchActivityData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/resources/recent`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const resources = await res.json();

      const activity = resources.map((resource: any) => ({
        name: resource.title.length > 15 ? `${resource.title.slice(0, 15)}...` : resource.title,
        views: resource.views || 0,
        downloads: resource.downloads || 0,
      }));

      setActivityData(activity);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  // -------------------------
  // CREATE CATEGORY
  // -------------------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: categoryName,
          description: categoryDescription,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create category");
      }

      toast({
        title: "Success",
        description: "Category created successfully",
      });

      setIsDialogOpen(false);
      setCategoryName('');
      setCategoryDescription('');

      fetchStats();
      fetchCategoryData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">

        {/* STATS GRID */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalStudents} students, {stats.totalTeachers} teachers
              </p>
            </CardContent>
          </Card>

          {/* Total Resources */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResources}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">Resource views</p>
            </CardContent>
          </Card>

          {/* Total Downloads */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">Resource downloads</p>
            </CardContent>
          </Card>
        </div>

        {/* CATEGORY PIE CHART */}
        <div className="grid gap-4 md:grid-cols-1">
          {/* <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Resources by Category</CardTitle>
              <CardDescription>Distribution of resources across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card> */}

          {/* RECENT RESOURCES BAR CHART */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Views and downloads for recent resources</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                  <Bar dataKey="downloads" fill="hsl(var(--secondary))" name="Downloads" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* CATEGORY MANAGEMENT */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Create and manage resource categories</CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-hero hover:opacity-90">
                  <Plus className="h-4 w-4" />
                  Create Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category for organizing resources
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Category
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total categories: {stats.totalCategories}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
