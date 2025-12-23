import { useState, useRef, useEffect } from "react";
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
import { ImagePlus, X, Trash2 } from "lucide-react";
import { Prompt } from "@/types/prompt";
import { toast } from "sonner";

interface EditPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: Prompt | null;
  onSave: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

const categories = [
  { value: "paisajes", label: "Paisajes" },
  { value: "retratos", label: "Retratos" },
  { value: "personajes", label: "Personajes" },
  { value: "surrealismo", label: "Surrealismo" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "fantasia", label: "Fantasía" },
  { value: "otro", label: "Otro" },
];

const EditPromptModal = ({ open, onOpenChange, prompt, onSave, onDelete }: EditPromptModalProps) => {
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [category, setCategory] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title || "");
      setPromptText(prompt.prompt);
      setCategory(prompt.category || "");
      setImagePreview(prompt.imageUrl);
    }
  }, [prompt]);

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
    
    if (!prompt) return;
    
    if (!title.trim() || !promptText.trim() || !category || !imagePreview) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    onSave({
      ...prompt,
      title: title.trim(),
      prompt: promptText.trim(),
      category,
      imageUrl: imagePreview,
      updatedAt: new Date().toISOString(),
    });

    toast.success("¡Prompt actualizado!");
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!prompt) return;
    onDelete(prompt.id);
    setShowDeleteConfirm(false);
    onOpenChange(false);
    toast.success("Prompt eliminado");
  };

  const isValid = title.trim() && promptText.trim() && category && imagePreview;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Editar Prompt
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4 py-4">
            <p className="text-foreground text-center">
              ¿Estás seguro de eliminar este prompt?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="edit-image">Imagen</Label>
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
                    htmlFor="edit-image"
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
                  id="edit-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Ciudad Cyberpunk"
                className="bg-muted/30 border-border/50 focus:border-primary"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-muted/30 border-border/50 focus:border-primary">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="edit-prompt">Prompt</Label>
              <Textarea
                id="edit-prompt"
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Describe tu prompt para generación de imágenes..."
                rows={4}
                className="bg-muted/30 border-border/50 focus:border-primary resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="destructive"
                className="flex-shrink-0"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                disabled={!isValid}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow disabled:opacity-50 disabled:shadow-none"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPromptModal;
