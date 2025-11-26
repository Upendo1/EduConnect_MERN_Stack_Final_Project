import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, Download, Trash2, BarChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const API_BASE = "https://educonnect-mern-stack-final-project.onrender.com";
const API_BASE = import.meta.env.VITE_API_BASE_URL
interface Resource {
  _id: string;
  title: string;
  description: string;
  file_type: string;
  file_size: number;
  file_url: string;
  createdAt: string;
  category: { name: string } | null;
  views: number;
  downloads: number;
}

interface Category {
  _id: string;
  name: string;
}

const TeacherDashboard = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchCategories();
    fetchResources();
    fetchAnalytics();
  }, []);

  // ---------------------------
  // Fetch Categories (Express)
  // ---------------------------
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // ---------------------------
  // Fetch Resources (Express)
  // ---------------------------
  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_BASE}/resources`);
      const data = await res.json();
      // console.log(data)
      setResources(data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  // ---------------------------
  // Fetch Analytics
  // ---------------------------
  // const fetchAnalytics = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE}/resources/analytics`);
  //     const data = await res.json();
  //     setAnalyticsData(data);
  //     // console.log(data)
  //   } catch (err) {
  //     console.error("Error fetching analytics:", err);
  //   }
  // };
const fetchAnalytics = async () => {
  try {
    const res = await fetch(`${API_BASE}/resources/analytics`);
    const data = await res.json();

    // Convert object → array for Recharts
    const chartData = [
      {
        name: "Totals",
        views: data.totalViews || 0,
        downloads: data.totalDownloads || 0,
      }
    ];

    setAnalyticsData(chartData);
  } catch (err) {
    console.error("Error fetching analytics:", err);
  }
};

  // ---------------------------
  // Upload Resource (Express)
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    if (formData.file) form.append("file", formData.file);

    const res = await fetch(`${API_BASE}/resources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,   // ✅ REQUIRED
      },
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");

    toast({
      title: "Success",
      description: "Resource uploaded successfully",
    });

    setIsDialogOpen(false);
    setFormData({ title: "", description: "", category: "", file: null });
    fetchResources();
    fetchAnalytics();

  } catch (err: any) {
    toast({
      title: "Error",
      description: err.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const form = new FormData();
  //     form.append("title", formData.title);
  //     form.append("description", formData.description);
  //     form.append("category", formData.category);
  //     if (formData.file) form.append("file", formData.file);

  //     const res = await fetch(`${API_BASE}/resources`, {
  //       method: 'POST',
  //       body: form
  //     });

  //     if (!res.ok) throw new Error('Upload failed');

  //     toast({
  //       title: 'Success',
  //       description: 'Resource uploaded successfully',
  //     });

  //     setIsDialogOpen(false);
  //     setFormData({ title: '', description: '', category: '', file: null });
  //     fetchResources();
  //     fetchAnalytics();

  //   } catch (err: any) {
  //     toast({
  //       title: 'Error',
  //       description: err.message,
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ---------------------------
  // Delete Resource (Express)
  // ---------------------------
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resources/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
        return;
      }

      toast({ title: 'Success', description: 'Deleted successfully' });
      fetchResources();
      fetchAnalytics();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const totalViews = resources.reduce((sum, r) => sum + (r.views || 0), 0);
  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloads || 0), 0);

  return (
    <DashboardLayout title="Teacher Dashboard">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader><CardTitle>Total Resources</CardTitle></CardHeader>
          <CardContent><div className="text-3xl">{resources.length}</div></CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Total Views</CardTitle></CardHeader>
          <CardContent><div className="text-3xl">{totalViews}</div></CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle>Total Downloads</CardTitle></CardHeader>
          <CardContent><div className="text-3xl">{totalDownloads}</div></CardContent>
        </Card>
      </div>

      {/* Analytics */}
      {/* <Card className="shadow-card mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" /> Resource Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" />
              <Bar dataKey="downloads" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
      <Card className="shadow-card mt-6">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <BarChart className="h-5 w-5" /> Resource Analytics
    </CardTitle>
  </CardHeader>

  <CardContent>
    <ResponsiveContainer width="100%" height={300}>
  <RechartsBarChart data={analyticsData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="views" fill="#4f46e5" />        {/* Indigo */}
    <Bar dataKey="downloads" fill="#10b981" />   {/* Emerald */}
  </RechartsBarChart>
</ResponsiveContainer>
  </CardContent>
</Card>


      {/* Resources list + upload */}
      <Card className="shadow-card mt-6">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle>My Resources</CardTitle>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Upload Resource
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Resource</DialogTitle>
              </DialogHeader>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(category) => setFormData({ ...formData, category })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>File</Label>
                  <Input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {loading ? "Uploading..." : "Upload Resource"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource._id} className="flex justify-between border p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold">{resource.title}</h3>
                  <p className="text-sm text-gray-500">
                    {resource.category?.name ?? "Uncategorized"} • {new Date(resource.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span><Eye className="h-3 w-3" /> {resource.views} views</span>
                    <span><Download className="h-3 w-3" /> {resource.downloads} downloads</span>
                  </div>
                </div>

                <Button variant="destructive" onClick={() => handleDelete(resource._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>

      </Card>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
