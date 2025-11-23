import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const StudentDashboard = () => {
  const [showCreate, setShowCreate] = useState(false);

  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const fetchResources = async () => {
    // existing function in your code
  };

  // ⬇️ PUT THE FUNCTION HERE
  const handleCreateResource = async () => {
    try {
      if (!newResource.file) {
        toast({
          title: "Error",
          description: "File is required",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", newResource.file);
      formData.append("title", newResource.title);
      formData.append("description", newResource.description);
      formData.append("category", newResource.category);

      const token = localStorage.getItem("token");

      const res = await fetch("/api/resources", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to create resource");

      toast({ title: "Success", description: "Resource created!" });

      setShowCreate(false);
      fetchResources();
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not create resource",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Create button */}
      <Button onClick={() => setShowCreate(true)}>+ Add Resource</Button>

      {/* Modal */}
      {showCreate && (
        <div>
          {/* modal inputs... */}
          <Button onClick={handleCreateResource}>Save</Button>
        </div>
      )}
    </>
  );
};

export default StudentDashboard;
