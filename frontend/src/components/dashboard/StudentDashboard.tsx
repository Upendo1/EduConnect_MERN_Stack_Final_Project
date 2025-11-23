import { useState, useEffect } from 'react';
import api from '@/api/apiClient';
import DashboardLayout from './DashboardLayout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import {
  Search,
  Download,
  Eye,
  FileText,
  Video,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
const API_BASE = import.meta.env.VITE_API_BASE_URL
// const API_BASE = "https://educonnect-mern-stack-final-project.onrender.com";

const StudentDashboard = () => {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // --- FETCH CATEGORIES ---
  const fetchCategories = async () => {
    try {
      const res = await api.get(`${API_BASE}/categories`, { headers: authHeaders() });
      setCategories(res.data || []);
    } catch (err) {
      toast({
        title: 'Error loading categories',
        description: 'Unable to load categories.',
        variant: 'destructive',
      });
    }
  };

  // --- FETCH RESOURCES ---
  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const res = await api.get(`${API_BASE}/resources`, {
        params,
        headers: authHeaders(),
      });

      setResources(res.data || []);
    } catch (err) {
      toast({
        title: 'Error loading resources',
        description: 'Unable to load resources.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchResources();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  // --- FIX: USE _id ---
  const trackView = async (_id) => {
    if (!_id) return console.error("Missing resource ID"); // safety
    try {
      await api.post(`${API_BASE}/resources/${_id}/view`, {}, { headers: authHeaders() });
    } catch {}
  };

  const trackDownload = async (_id) => {
    if (!_id) return console.error("Missing resource ID"); // safety
    try {
      await api.post(`${API_BASE}/resources/${_id}/download`, {}, { headers: authHeaders() });
    } catch {}
  };

  // --- VIEW FILE ---
  const handleView = async (resource) => {
    await trackView(resource._id); // ✅ FIXED
    window.open(resource.file_url, '_blank');
  };

  // --- DOWNLOAD FILE ---
  const handleDownload = async (resource) => {
    await trackDownload(resource._id); // ✅ FIXED

    const link = document.createElement('a');
    link.href = resource.file_url;
    link.download = resource.title || 'download';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getFileIcon = (type) => {
    if (!type) return <FileText className="h-5 w-5" />;
    if (type.includes('video')) return <Video className="h-5 w-5" />;
    if (type.includes('image')) return <ImageIcon className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes <= 0) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
  };

  const filteredResources = resources.filter((r) =>
    (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Learning Resources">
      <div className="space-y-6">

        {/* Search & Filter */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Browse Resources</CardTitle>
            <CardDescription>
              Search and filter through available learning materials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}> {/* ✅ FIXED */}
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <Card><CardContent className="py-12 text-center">No resources found.</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((res) => (
              <Card key={res._id} className="shadow-card hover:shadow-glow transition duration-300"> {/* ✅ FIXED */}
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getFileIcon(res.file_type)}
                    <CardTitle className="text-lg">{res.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {res.description || 'No description available'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Category: {res.category?.name || 'Uncategorized'}</p>
                    {/* <p>Teacher: {res.teacher?.full_name || '—'}</p> */}
                    <p>Size: {formatSize(res.file_size)}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" size="sm" onClick={() => handleView(res)}>
                      <Eye className="h-4 w-4" /> View
                    </Button>
                    <Button className="flex-1 gap-2" size="sm" variant="outline" onClick={() => handleDownload(res)}>
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </div>
                </CardContent>

              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
