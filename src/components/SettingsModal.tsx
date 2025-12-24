import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
    X, Plus, Trash2, Download, Upload, RotateCcw,
    LayoutGrid, Grid3x3, Monitor
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: string[];
    onUpdateCategories: (newCategories: string[]) => void;
    onExportData: () => void;
    onImportData: (file: File) => void;
    onResetData: () => void;
    gridColumns: 2 | 3 | 4;
    onGridColumnsChange: (cols: 2 | 3 | 4) => void;
}

const SettingsModal = ({
    open,
    onOpenChange,
    categories,
    onUpdateCategories,
    onExportData,
    onImportData,
    onResetData,
    gridColumns,
    onGridColumnsChange
}: SettingsModalProps) => {
    const [newCategory, setNewCategory] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            if (categories.includes(newCategory.trim())) {
                toast.error("La categoría ya existe");
                return;
            }
            onUpdateCategories([...categories, newCategory.trim()]);
            setNewCategory("");
        }
    };

    const handleRemoveCategory = (indexToRemove: number) => {
        onUpdateCategories(categories.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddCategory();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImportData(file);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-border/50 max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ajustes de Galer.IA</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="categories" className="flex-1 overflow-hidden flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="categories">Categorías</TabsTrigger>
                        <TabsTrigger value="appearance">Apariencia</TabsTrigger>
                        <TabsTrigger value="data">Datos</TabsTrigger>
                    </TabsList>

                    {/* CATEGORÍAS */}
                    <TabsContent value="categories" className="flex-1 overflow-y-auto pt-4 space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Nueva categoría..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button onClick={handleAddCategory} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {categories.map((category, index) => (
                                <div
                                    key={`${category}-${index}`}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group"
                                >
                                    <span className="text-sm font-medium">{category}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => handleRemoveCategory(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-center text-sm text-muted-foreground py-8">
                                    No hay categorías definidas.
                                </p>
                            )}
                        </div>
                    </TabsContent>

                    {/* APARIENCIA */}
                    <TabsContent value="appearance" className="pt-4 space-y-6">
                        <div className="space-y-3">
                            <Label>Cuadrícula (Columnas)</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={() => onGridColumnsChange(2)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                        gridColumns === 2 ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <LayoutGrid className="w-6 h-6" />
                                    <span className="text-xs font-medium">Grande (2)</span>
                                </button>
                                <button
                                    onClick={() => onGridColumnsChange(3)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                        gridColumns === 3 ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <Grid3x3 className="w-6 h-6" />
                                    <span className="text-xs font-medium">Media (3)</span>
                                </button>
                                <button
                                    onClick={() => onGridColumnsChange(4)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                        gridColumns === 4 ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50"
                                    )}
                                >
                                    <Monitor className="w-6 h-6" />
                                    <span className="text-xs font-medium">Compacta (4)</span>
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ajusta cuántas tarjetas se ven por fila en pantallas grandes. En móviles siempre se adaptará al ancho disponible.
                            </p>
                        </div>
                    </TabsContent>

                    {/* DATOS */}
                    <TabsContent value="data" className="pt-4 space-y-6">
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/40 border border-border/50 space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Copia de Seguridad
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Descarga un archivo JSON con todos tus prompts y categorías por seguridad.
                                </p>
                                <Button onClick={onExportData} variant="outline" className="w-full">
                                    Exportar Datos
                                </Button>
                            </div>

                            <div className="p-4 rounded-lg bg-muted/40 border border-border/50 space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Restaurar
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Importa un archivo JSON previamente exportado. Esto sobrescribirá los datos actuales.
                                </p>
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                                        Importar Datos
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/10 space-y-3">
                                <h3 className="font-semibold text-destructive flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Zona de Peligro
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Borra todos los prompts y configuraciones. Esta acción no se puede deshacer.
                                </p>
                                <Button onClick={onResetData} variant="destructive" className="w-full">
                                    Resetear Todo
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsModal;
