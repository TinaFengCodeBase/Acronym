
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Acronym } from "../types/types";

interface AcronymFormProps {
  onSubmit: (acronym: Omit<Acronym, "id" | "createdAt" | "updatedAt">) => void;
  initialValues?: Acronym;
  onCancel?: () => void;
}

export const AcronymForm = ({ onSubmit, initialValues, onCancel }: AcronymFormProps) => {
  const [formData, setFormData] = useState({
    acronym: initialValues?.acronym || "",
    description: initialValues?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter acronym"
          value={formData.acronym}
          onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
          className="mb-2"
          required
        />
      </div>
      <div>
        <Textarea
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mb-4"
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">
          {initialValues ? "Update" : "Add"} Acronym
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
