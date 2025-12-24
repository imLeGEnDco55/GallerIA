import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePlus, X } from "lucide-react";
import { Prompt } from "@/types/prompt";
import { toast } from "sonner";

interface AddPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (prompt: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => void;
  categories: string[];
}

const AddPromptModal = ({ open, onOpenChange, onSave, categories }: AddPromptModalProps) => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !prompt.trim() || !category || !imagePreview) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    onSave({
      title: title.trim(),
      prompt: prompt.trim(),
      category,
      imageUrl: imagePreview,
      isFavorite: false,
      tags: [],
    });

    // Reset form
    setTitle("");
    setPrompt("");
    setCategory("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("¡Prompt agregado exitosamente!");
    onOpenChange(false);
  };

  const isValid = title.trim() && prompt.trim() && category && imagePreview;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Nuevo Prompt
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Imagen</Label>
            <div className="relative">
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-border/50 bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
                >
                  <ImagePlus className="w-10 h-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Haz clic para subir imagen
                  </span>
                </label>
              )}
              <input
                ref={fileInputRef}
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Ciudad Cyberpunk"
              className="bg-muted/30 border-border/50 focus:border-primary"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prompt */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe tu prompt para generación de imágenes..."
              rows={4}
              className="bg-muted/30 border-border/50 focus:border-primary resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow disabled:opacity-50 disabled:shadow-none"
          >
            Guardar Prompt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPromptModal;
