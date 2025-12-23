import { useState, useMemo, useEffect } from "react";
import { db } from "@/lib/db";
import PromptCard from "@/components/PromptCard";
import AddPromptModal from "@/components/AddPromptModal";
import EditPromptModal from "@/components/EditPromptModal";
import { samplePrompts } from "@/data/samplePrompts";
import { Prompt } from "@/types/prompt";
import { Plus, Search, X, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

// Categorías disponibles
const CATEGORIES = ["Paisajes", "Retratos", "Arte", "Ciencia ficción", "Fantasía"];

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Cargar prompts desde DB
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const storedPrompts = await db.getAllPrompts();
        if (storedPrompts.length > 0) {
          // Sort desc by date since index returns asc usually, or just reverse.
          setPrompts(storedPrompts.reverse());
        } else {
          // Initialize with samples if empty
          for (const p of samplePrompts) {
            await db.addPrompt(p);
          }
          setPrompts(samplePrompts);
        }
      } catch (error) {
        console.error("Error loading prompts:", error);
        setPrompts(samplePrompts); // Fallback
      }
    };
    loadPrompts();
  }, []);

  // Separar favoritos y no favoritos
  const { favorites, regularPrompts } = useMemo(() => {
    const favs = prompts.filter((p) => p.isFavorite);
    const regular = prompts.filter((p) => !p.isFavorite);
    return { favorites: favs, regularPrompts: regular };
  }, [prompts]);

  // Filtrado en tiempo real por texto y categoría
  const filteredPrompts = useMemo(() => {
    let result = prompts;

    // Filtrar por categoría
    if (selectedCategory) {
      result = result.filter((prompt) => prompt.category === selectedCategory);
    }

    // Filtrar por texto
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((prompt) =>
        prompt.title?.toLowerCase().includes(term) ||
        prompt.prompt.toLowerCase().includes(term) ||
        prompt.category?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [prompts, searchTerm, selectedCategory]);

  // Separar favoritos de filtrados
  const filteredFavorites = useMemo(() => filteredPrompts.filter((p) => p.isFavorite), [filteredPrompts]);
  const filteredRegular = useMemo(() => filteredPrompts.filter((p) => !p.isFavorite), [filteredPrompts]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const handleAddPrompt = async (newPromptData: Omit<Prompt, "id" | "createdAt" | "updatedAt">) => {
    const newPrompt: Prompt = {
      ...newPromptData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.addPrompt(newPrompt);
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  const handleToggleFavorite = async (id: string) => {
    const promptToUpdate = prompts.find(p => p.id === id);
    if (promptToUpdate) {
      const updated = { ...promptToUpdate, isFavorite: !promptToUpdate.isFavorite };
      await db.updatePrompt(updated);
      setPrompts((prev) =>
        prev.map((prompt) =>
          prompt.id === id ? updated : prompt
        )
      );
    }
  };

  const handleEditPrompt = (id: string) => {
    const promptToEdit = prompts.find((p) => p.id === id);
    if (promptToEdit) {
      setEditingPrompt(promptToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = async (updatedPrompt: Prompt) => {
    await db.updatePrompt(updatedPrompt);
    setPrompts((prev) =>
      prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
    );
  };

  const handleDeletePrompt = async (id: string) => {
    await db.deletePrompt(id);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
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
      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Search results indicator */}
        {(searchTerm || selectedCategory) && (
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredPrompts.length} resultado{filteredPrompts.length !== 1 ? 's' : ''}
            {searchTerm && <span> para "{searchTerm}"</span>}
            {selectedCategory && <span> en {selectedCategory}</span>}
          </div>
        )}

        {/* Favoritos (pinneds) */}
        {filteredFavorites.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-foreground">Favoritos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
              {filteredFavorites.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  id={prompt.id}
                  imageUrl={prompt.imageUrl}
                  prompt={prompt.prompt}
                  title={prompt.title}
                  isFavorite={prompt.isFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={handleEditPrompt}
                />
              ))}
            </div>
          </>
        )}

        {/* Grid de tarjetas regulares */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredRegular.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              imageUrl={prompt.imageUrl}
              prompt={prompt.prompt}
              title={prompt.title}
              isFavorite={prompt.isFavorite}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEditPrompt}
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

      {/* Floating Search Button */}
      <div className="fixed bottom-6 left-6 z-50">
        {/* Search Overlay Panel */}
        <div
          className={cn(
            "absolute bottom-16 left-0 transition-all duration-300 ease-out origin-bottom-left",
            isSearchOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-2 pointer-events-none"
          )}
        >
          <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4 w-72 sm:w-80">
            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o prompt..."
                className="w-full h-11 pl-4 pr-10 rounded-xl bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                autoFocus={isSearchOpen}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {(searchTerm || selectedCategory) && (
              <p className="mt-3 text-xs text-muted-foreground">
                {filteredPrompts.length} resultado{filteredPrompts.length !== 1 ? 's' : ''}
                {selectedCategory && <span className="ml-1">en {selectedCategory}</span>}
              </p>
            )}
          </div>
        </div>

        {/* FAB Button */}
        <button
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            if (isSearchOpen) {
              setSearchTerm("");
              setSelectedCategory(null);
            }
          }}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
            isSearchOpen
              ? "bg-primary text-primary-foreground rotate-0"
              : "bg-card border border-border/50 text-foreground hover:bg-muted"
          )}
          aria-label={isSearchOpen ? "Cerrar búsqueda" : "Buscar"}
        >
          {isSearchOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Search className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Add Prompt Modal */}
      <AddPromptModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleAddPrompt}
      />

      {/* Edit Prompt Modal */}
      <EditPromptModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        prompt={editingPrompt}
        onSave={handleSaveEdit}
        onDelete={handleDeletePrompt}
      />
    </div>
  );
};

export default Index;
