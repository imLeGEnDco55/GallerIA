import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PromptCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  title?: string;
}

const PromptCard = ({ id, imageUrl, prompt, title }: PromptCardProps) => {
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
          
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-sm font-medium text-foreground truncate">{title}</p>
            </div>
          )}
          
          {/* Flip indicator */}
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs text-muted-foreground">Tap para ver prompt</span>
          </div>
        </div>

        {/* Back - Prompt */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg overflow-hidden shadow-card border border-primary/30 bg-gradient-to-br from-card to-muted p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {title && (
              <h3 className="text-sm font-semibold text-primary mb-2">{title}</h3>
            )}
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {prompt}
            </p>
          </div>
          
          <button
            onClick={handleCopy}
            className={cn(
              "mt-3 w-full py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-all duration-200",
              "bg-primary text-primary-foreground font-medium",
              "hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]",
              isCopied && "bg-accent"
            )}
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Prompt</span>
              </>
            )}
          </button>
          
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
