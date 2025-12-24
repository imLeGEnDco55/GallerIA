import { useState } from "react";
import { Copy, Check, Heart, Pencil, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  title?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const PromptCard = ({ id, imageUrl, prompt, title, isFavorite = false, onToggleFavorite, onEdit }: PromptCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt);
      setIsCopied(true);
      toast.success("¡Prompt copiado!", {
        description: "Pegalo en tu generador de imágenes favorito",
      });

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("No se pudo copiar el prompt");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || "Prompt de Galer.IA",
          text: prompt,
        });
      } catch (err) {
        // Share cancelled or failed
      }
    } else {
      toast.info("Compartir es nativo de móviles", {
        description: "En escritorio usa el botón de copiar."
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  return (
    <div
      className="perspective w-full aspect-[3/4] cursor-pointer group"
      onClick={handleFlip}
    >
      <div
        className={cn(
          "flip-card-inner relative w-full h-full",
          isFlipped && "flipped"
        )}
      >
        {/* Front - Image */}
        <div className="absolute inset-0 backface-hidden rounded-lg overflow-hidden shadow-card border border-border/50 bg-card">
          <img
            src={imageUrl}
            alt={title || "Prompt image"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite button */}
          <button
            onClick={handleFavorite}
            className={cn(
              "absolute top-2 left-2 p-2 rounded-full transition-all duration-300 z-10",
              "bg-background/60 backdrop-blur-sm hover:bg-background/80",
              isFavorite ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all duration-300",
                isFavorite
                  ? "fill-accent text-accent scale-110"
                  : "text-foreground/70 hover:text-accent"
              )}
            />
          </button>

          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium text-foreground truncate">{title}</p>
            </div>
          )}

          {/* Edit button */}
          <button
            onClick={handleEdit}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            aria-label="Editar prompt"
          >
            <Pencil className="w-4 h-4 text-foreground/70" />
          </button>
        </div>

        {/* Back - Prompt */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-card border border-primary/30 bg-gradient-to-br from-card to-muted p-4 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            {title && (
              <h3 className="text-sm font-semibold text-primary flex-1">{title}</h3>
            )}
            <button
              onClick={handleFavorite}
              className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all duration-300",
                  isFavorite
                    ? "fill-accent text-accent"
                    : "text-muted-foreground hover:text-accent"
                )}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {prompt}
            </p>
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleCopy}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200",
                "bg-primary text-primary-foreground font-medium",
                "hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
                isCopied && "bg-accent"
              )}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center shadow-sm"
              aria-label="Compartir"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tap to flip back indicator */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            Tap para volver
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
