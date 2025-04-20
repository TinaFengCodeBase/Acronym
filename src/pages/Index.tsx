
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Acronym } from "../types/types";
import { AcronymForm } from "../components/AcronymForm";
import { saveAcronymsToFile, loadAcronymsFromFile } from "../utils/fileUtils";
import { 
  Plus,
  Search,
  Save,
  Save as FileExport,
  Trash2,
  ArrowDownAZ,
  ArrowUpZA
} from "lucide-react";

const Index = () => {
  const [acronyms, setAcronyms] = useState<Acronym[]>(() => {
    const saved = localStorage.getItem("acronyms");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAcronym, setEditingAcronym] = useState<Acronym | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    localStorage.setItem("acronyms", JSON.stringify(acronyms));
  }, [acronyms]);

  const handleAdd = (newAcronym: Omit<Acronym, "id" | "createdAt" | "updatedAt">) => {
    const acronym: Acronym = {
      id: crypto.randomUUID(),
      ...newAcronym,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAcronyms([...acronyms, acronym]);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (updatedAcronym: Omit<Acronym, "id" | "createdAt" | "updatedAt">) => {
    if (!editingAcronym) return;
    
    setAcronyms(acronyms.map((a) =>
      a.id === editingAcronym.id
        ? {
            ...editingAcronym,
            ...updatedAcronym,
            updatedAt: new Date().toISOString(),
          }
        : a
    ));
    setEditingAcronym(null);
  };

  const handleDelete = (id: string) => {
    setAcronyms(acronyms.filter((a) => a.id !== id));
  };

  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const filteredAndSortedAcronyms = acronyms
    .filter((acronym) =>
      acronym.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acronym.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const comparison = a.acronym.localeCompare(b.acronym);
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Master Acronym Management</h1>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search acronyms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
        <Button variant="outline" onClick={handleSort}>
          {sortDirection === "asc" ? (
            <ArrowDownAZ className="h-4 w-4" />
          ) : (
            <ArrowUpZA className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={async () => {
            try {
              const loadedAcronyms = await loadAcronymsFromFile();
              setAcronyms(loadedAcronyms);
            } catch (error) {
              console.error("Error loading acronyms:", error);
            }
          }}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={() => saveAcronymsToFile(acronyms)}
        >
          <FileExport className="h-4 w-4" />
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Acronym</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedAcronyms.map((acronym) => (
              <TableRow key={acronym.id}>
                <TableCell className="font-medium">{acronym.acronym}</TableCell>
                <TableCell>{acronym.description}</TableCell>
                <TableCell>
                  {new Date(acronym.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAcronym(acronym)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(acronym.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Acronym</DialogTitle>
          </DialogHeader>
          <AcronymForm
            onSubmit={handleAdd}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAcronym} onOpenChange={() => setEditingAcronym(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Acronym</DialogTitle>
          </DialogHeader>
          {editingAcronym && (
            <AcronymForm
              initialValues={editingAcronym}
              onSubmit={handleEdit}
              onCancel={() => setEditingAcronym(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
