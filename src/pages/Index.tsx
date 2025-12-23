import { useState } from "react";
import PromptCard from "@/components/PromptCard";
import AddPromptModal from "@/components/AddPromptModal";
import { samplePrompts } from "@/data/samplePrompts";
import { Prompt } from "@/types/prompt";
import { Plus } from "lucide-react";

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-transform duration-200"
              aria-label="Agregar nuevo prompt"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Grid de tarjetas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {prompts.map((prompt) => (
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
        {prompts.length === 0 && (
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
