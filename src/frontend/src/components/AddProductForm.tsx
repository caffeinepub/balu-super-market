import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddProduct, useProducts } from "../hooks/useQueries";
import { setProductImage } from "../utils/productImages";

const CATEGORIES = [
  "Grocery",
  "Fresh Fruits",
  "Fresh Juice",
  "Hot Items",
  "Cold Items",
];

export function AddProductForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const addProduct = useAddProduct();
  const { data: products } = useProducts();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    const parsedPrice = Number.parseInt(price, 10);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    const existingIds = (products || []).map((p) => Number(p.id));
    const newId = BigInt(
      existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1,
    );

    const trimmedName = name.trim();
    const trimmedImageUrl = imageUrl.trim();

    addProduct.mutate(
      {
        id: newId,
        name: trimmedName,
        category,
        price: BigInt(parsedPrice),
        description: description.trim(),
      },
      {
        onSuccess: () => {
          // Save custom image URL if provided
          if (trimmedImageUrl) {
            setProductImage(trimmedName, trimmedImageUrl);
          }
          toast.success(`"${trimmedName}" added successfully!`);
          setName("");
          setCategory("");
          setPrice("");
          setDescription("");
          setImageUrl("");
          setImagePreviewError(false);
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to add product. Please try again.");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-market-green hover:bg-market-green/90 text-white font-semibold gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground flex items-center gap-2">
            <span>🛒</span> Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="grid gap-1.5">
            <Label htmlFor="prod-name">Product Name</Label>
            <Input
              id="prod-name"
              placeholder="e.g. Organic Brown Rice (1kg)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="prod-category">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-price">Price (₹)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-market-green">
                ₹
              </span>
              <Input
                id="prod-price"
                type="number"
                placeholder="0"
                className="pl-8"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                required
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-desc">Description</Label>
            <Textarea
              id="prod-desc"
              placeholder="Brief description of the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="prod-image" className="flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              Product Image URL
              <span className="text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Input
              id="prod-image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setImagePreviewError(false);
              }}
            />
            {imageUrl && !imagePreviewError && (
              <div className="relative w-full h-28 rounded-lg overflow-hidden border border-border bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
            {imageUrl && imagePreviewError && (
              <p className="text-xs text-destructive">
                Could not load image from that URL. Please check the link.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="submit"
              className="flex-1 bg-market-green hover:bg-market-green/90 text-white"
              disabled={addProduct.isPending}
            >
              {addProduct.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
