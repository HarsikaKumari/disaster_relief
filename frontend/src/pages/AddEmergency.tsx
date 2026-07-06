/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Clock,
  Droplet,
  FileText,
  Flame,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Upload,
  User,
  Users,
  Wind,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "../components/layouts/Navbar";
import { Sidebar } from "../components/layouts/sidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../lib/api";

interface EmergencyFormData {
  title: string;
  type: string;
  severity: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  victimName: string;
  victimPhone: string;
  victimCount: number;
}

export const AddEmergency = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [step, setStep] = useState(1);
  const [emergencyId, setEmergencyId] = useState("");
  const [formData, setFormData] = useState<EmergencyFormData>({
    title: "",
    type: "FIRE",
    severity: "HIGH",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    victimName: "",
    victimPhone: "",
    victimCount: 1,
  });
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const uploadImages = async (emergencyId: string) => {
    if (selectedImages.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    selectedImages.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await api.post(
        `/upload/emergency/${emergencyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(`${selectedImages.length} image(s) uploaded successfully!`);
        setSelectedImages([]);
        setImagePreviews([]);
      } else {
        toast.error(response.data.message || "Failed to upload images");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        severity: formData.severity,
        description: formData.description,
        location: formData.location,
        latitude: parseFloat(formData.latitude) || 28.6139,
        longitude: parseFloat(formData.longitude) || 77.209,
        victimName: formData.victimName || undefined,
        victimPhone: formData.victimPhone || undefined,
        victimCount: parseInt(formData.victimCount.toString()) || 1,
      };

      const response = await api.post("/emergencies", payload);

      if (response.data.success) {
        const newEmergencyId = response.data.data.id;
        setEmergencyId(newEmergencyId);
        if (selectedImages.length > 0) {
          await uploadImages(newEmergencyId);
        }

        toast.success("Emergency added successfully!");
        setStep(2);
      } else {
        setError(response.data.message || "Failed to add emergency");
        toast.error(response.data.message || "Failed to add emergency");
      }
    } catch (err: any) {
      console.error("Add emergency error:", err);
      const message = err.response?.data?.message || "Failed to add emergency";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "FLOOD":
        return <Droplet className="w-4 h-4" />;
      case "EARTHQUAKE":
        return <Zap className="w-4 h-4" />;
      case "FIRE":
        return <Flame className="w-4 h-4" />;
      case "CYCLONE":
        return <Wind className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-light via-[#F5EDE4] to-accent/5 flex">
      <Sidebar
        active="Emergencies"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 min-w-0 overflow-y-auto h-screen">
        <Navbar
          title="Add Emergency"
          subtitle="Report a new emergency"
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content */}
        <div className="p-3 md:p-4 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {step === 1 ? (
              <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl shadow-primary/5 border border-white/40">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
                  <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-error" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">
                      Emergency Details
                    </h2>
                    <p className="text-xs text-text-tertiary">
                      Fill in the details of the emergency
                    </p>
                  </div>
                  <Badge className="ml-auto bg-error/10 text-error border-error/20 text-[10px]">
                    <Clock className="w-2.5 h-2.5 mr-1" />
                    Urgent
                  </Badge>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Emergency Title */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-text-tertiary" />
                      Emergency Title <span className="text-error">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Major Fire in Industrial Area"
                      required
                      className="bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm placeholder:text-text-tertiary/50"
                    />
                  </div>

                  {/* Type & Severity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                        <span className="text-lg">
                          {getTypeIcon(formData.type)}
                        </span>
                        Disaster Type <span className="text-error">*</span>
                      </Label>
                      <select
                        id="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <option value="FLOOD">🌊 Flood</option>
                        <option value="EARTHQUAKE">🏔️ Earthquake</option>
                        <option value="FIRE">🔥 Fire</option>
                        <option value="CYCLONE">🌀 Cyclone</option>
                        <option value="LANDSLIDE">⛰️ Landslide</option>
                        <option value="ACCIDENT">🚨 Accident</option>
                        <option value="OTHER">📌 Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            formData.severity === "CRITICAL"
                              ? "bg-error"
                              : formData.severity === "HIGH"
                              ? "bg-error/80"
                              : formData.severity === "MEDIUM"
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        />
                        Severity <span className="text-error">*</span>
                      </Label>
                      <select
                        id="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        className="w-full h-11 px-4 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-sm appearance-none cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <option value="LOW">🟢 Low</option>
                        <option value="MEDIUM">🟡 Medium</option>
                        <option value="HIGH">🟠 High</option>
                        <option value="CRITICAL">🔴 Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-text-tertiary" />
                      Description <span className="text-error">*</span>
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the emergency in detail..."
                      rows={3}
                      className="w-full bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm placeholder:text-text-tertiary/50 resize-none"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-text-tertiary" />
                      Location <span className="text-error">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary/50" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter address or area name"
                        className="pl-10 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm placeholder:text-text-tertiary/50"
                        required
                      />
                    </div>
                  </div>

                  {/* Latitude & Longitude */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Latitude{" "}
                        <span className="text-text-tertiary text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        id="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="e.g. 28.6139"
                        className="bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-text-primary">
                        Longitude{" "}
                        <span className="text-text-tertiary text-xs">
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        id="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="e.g. 77.2090"
                        className="bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-11 text-sm"
                      />
                    </div>
                  </div>

                  {/* Victim Details */}
                  <div className="bg-sand-light/30 rounded-xl p-4 border border-white/20">
                    <p className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-text-tertiary" />
                      Victim Information
                      <span className="text-xs text-text-tertiary font-normal">
                        (Optional)
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-text-secondary">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50" />
                          <Input
                            id="victimName"
                            value={formData.victimName}
                            onChange={handleChange}
                            placeholder="Name"
                            className="pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm placeholder:text-text-tertiary/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-text-secondary">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50" />
                          <Input
                            id="victimPhone"
                            value={formData.victimPhone}
                            onChange={handleChange}
                            placeholder="Phone number"
                            className="pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm placeholder:text-text-tertiary/50"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Label className="text-xs text-text-secondary">
                        Number of Victims
                      </Label>
                      <div className="relative mt-1">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary/50" />
                        <Input
                          id="victimCount"
                          type="number"
                          value={formData.victimCount}
                          onChange={handleChange}
                          min="1"
                          className="pl-9 bg-white/60 border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl h-10 text-sm w-24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✅ IMAGES UPLOAD WITH PREVIEW */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <Camera className="w-4 h-4 text-text-tertiary" />
                      Upload Images
                      <span className="text-xs text-text-tertiary font-normal">
                        (Optional, max 5 images)
                      </span>
                    </Label>

                    {/* Upload Area */}
                    <div
                      className={`border-2 border-dashed ${
                        imagePreviews.length > 0
                          ? "border-primary/50 bg-primary/5"
                          : "border-white/30 hover:border-primary/50"
                      } transition-all duration-300 rounded-xl p-6 text-center cursor-pointer group`}
                      onClick={() => document.getElementById("imageInput")?.click()}
                    >
                      <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={uploadingImages || loading}
                      />
                      <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                        <Upload className="w-6 h-6 text-text-tertiary/50 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-text-tertiary mt-2 group-hover:text-text-primary transition-colors">
                        Click or drag to upload images
                      </p>
                      <p className="text-xs text-text-tertiary/50 mt-0.5">
                        PNG, JPG, JPEG up to 5MB each (max 5 images)
                      </p>
                      {imagePreviews.length > 0 && (
                        <p className="text-xs text-primary mt-2">
                          {imagePreviews.length} image(s) selected
                        </p>
                      )}
                    </div>

                    {/* ✅ Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative group rounded-xl overflow-hidden border border-white/30 aspect-square bg-white/50"
                          >
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-error rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={uploadingImages || loading}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Link to="/emergencies" className="flex-1">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-secondary/80 cursor-pointer border-white/30 text-text-secondary hover:bg-secondary/50 rounded-xl h-11"
                      >
                        Cancel
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      disabled={loading || uploadingImages}
                      className="flex-[2] bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg shadow-primary/20 h-11 font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : uploadingImages ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading Images...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Emergency
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/60 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl shadow-primary/5 border border-white/40"
              >
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-success" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-text-primary mt-5">
                  Emergency Added! 🎉
                </h2>
                <p className="text-text-secondary mt-2 max-w-sm mx-auto">
                  {selectedImages.length > 0
                    ? `Emergency added with ${selectedImages.length} image(s). Response team has been notified.`
                    : "The emergency has been added successfully. Response team has been notified."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Link to="/emergencies" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-11">
                      View All Emergencies
                    </Button>
                  </Link>
                  <Link to={`/emergencies/${emergencyId}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full border-white/30 text-text-secondary hover:bg-white/50 rounded-xl h-11"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};