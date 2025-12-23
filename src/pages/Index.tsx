import { useState, useMemo } from "react";
import PromptCard from "@/components/PromptCard";
import AddPromptModal from "@/components/AddPromptModal";
import { samplePrompts } from "@/data/samplePrompts";
import { Prompt } from "@/types/prompt";
import { Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrado en tiempo real
  const filteredPrompts = useMemo(() => {
    if (!searchTerm.trim()) return prompts;
    
    const term = searchTerm.toLowerCase();
    return prompts.filter((prompt) =>
      prompt.title?.toLowerCase().includes(term) ||
      prompt.prompt.toLowerCase().includes(term) ||
      prompt.category?.toLowerCase().includes(term)
    );
  }, [prompts, searchTerm]);

  const handleAddPrompt = (newPromptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => {
    const newPrompt: Prompt = {
      ...newPromptData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setPrompts((prev) =>
      prev.map((prompt) =>
        prompt.id === id
          ? { ...prompt, isFavorite: !prompt.isFavorite }
          : prompt
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Prompt Album
              </h1>
              <p className="text-sm text-muted-foreground">
                Tu colección de prompts para IA
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search toggle + input */}
              <div className="flex items-center">
                <div
                  className={cn(
                    "flex items-center overflow-hidden transition-all duration-300 ease-out",
                    isSearchOpen ? "w-48 sm:w-64" : "w-0"
                  )}
                >
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar prompts..."
                      className="w-full h-10 pl-3 pr-8 rounded-full bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      autoFocus={isSearchOpen}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                      >
                        <X className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsSearchOpen(!isSearchOpen);
                    if (isSearchOpen) setSearchTerm("");
                  }}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
                    isSearchOpen 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar"}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-transform duration-200"
                aria-label="Agregar nuevo prompt"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search results indicator */}
        {searchTerm && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredPrompts.length} resultado{filteredPrompts.length !== 1 ? 's' : ''} para "{searchTerm}"
          </div>
        )}

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              imageUrl={prompt.imageUrl}
              prompt={prompt.prompt}
              title={prompt.title}
              isFavorite={prompt.isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredPrompts.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sin resultados
            </h2>
            <p className="text-muted-foreground max-w-sm">
              No se encontraron prompts para "{searchTerm}"
            </p>
          </div>
        )}

        {prompts.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sin prompts aún
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Comienza agregando tu primer prompt tocando el botón + arriba
            </p>
          </div>
        )}
      </main>

      {/* Add Prompt Modal */}
      <AddPromptModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddPrompt}
      />
    </div>
  );
};

export default Index;
