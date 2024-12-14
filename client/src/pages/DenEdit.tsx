import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { updateDenById, getDenById } from "@/api/Den";
import { Label } from "@/components/ui/label";
import {Den} from "@/interfaces/interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function EditDenPage() {
  const { id } = useParams<{ id: string }>();
  const [denData, setDenData] = useState<Partial<Den>>({ name: "", description: "", avatar: "", banner: "" , visibility: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDenData = async () => {
      try {
        const den = await getDenById(id!);
        setDenData({
          name: den.name || "",
          description: den.description || "",
          avatar: den.avatar || "",
          banner: den.banner || "",
          visibility: den.visibility || "",
          
        });
      } catch (err) {
        setError("Failed to load Den data.");
        console.error("Error fetching Den data:", err);
      }
    };

    if (id) fetchDenData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDenData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateDen = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      await updateDenById(id!, denData, token);
      navigate(`/d/${id}`); // Redirect back to the Den page after update
    } catch (err) {
      setError("Failed to update Den.");
      console.error("Error updating Den:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" p-4">
         {/* go back arrow */}
         <div className="flex items-center mb-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 cursor-pointer"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => window.history.back()}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-xl font-bold">Edit Den</span>
                </div>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Den Name</label>
          <Input
            name="name"
            value={denData.name}
            onChange={handleInputChange}
            placeholder="Enter Den name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <Input
            name="description"
            value={denData.description}
            onChange={handleInputChange}
            placeholder="Enter Den description"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Avatar</label>
          <Input
            name="avatar"
            type="File" 
            onChange={handleInputChange}
            placeholder="Enter avatar URL"
          />
        </div>

        <div>
          <Label className="block font-medium mb-1">Banner</Label>
          <Input
            name="banner"
            type="File"
            onChange={handleInputChange}
            placeholder="Enter banner URL"
          />
        </div>
        <div>
        <Label >Visibility</Label>
          <Select onValueChange={(value) => setDenData((prevData) => ({ ...prevData, visibility: value }))}>
            <SelectTrigger>
              <SelectValue placeholder={denData.visibility ||" Select Visibility"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="restricted">Restricted</SelectItem>
            </SelectContent>
          </Select>

        </div>

   



        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => navigate(`/den/${id}`)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateDen} disabled={loading}>
            {loading ? "Updating..." : "Update Den"}
          </Button>
        </div>
      </div>
    </div>

  );
}

export default EditDenPage;
