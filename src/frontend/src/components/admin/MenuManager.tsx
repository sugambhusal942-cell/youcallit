import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Check,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { DietaryTag } from "../../backend";
import type { MenuItem } from "../../backend";
import {
  useAddMenuItem,
  useDeleteMenuItem,
  useMenuCategories,
  useMenuItems,
  useToggleItemAvailability,
  useUpdateMenuItem,
} from "../../hooks/useQueries";
import { DietaryBadge } from "../ui/DietaryBadge";
import { PriceDisplay } from "../ui/PriceDisplay";

const DIETARY_OPTIONS = Object.values(DietaryTag);

interface ItemFormState {
  name: string;
  categoryId: string;
  description: string;
  price: string;
  imageUrl: string;
  tags: DietaryTag[];
  calories: string;
}

const EMPTY_FORM: ItemFormState = {
  name: "",
  categoryId: "",
  description: "",
  price: "",
  imageUrl: "",
  tags: [],
  calories: "",
};

function AddItemForm({
  categoryId: defaultCategoryId,
  onClose,
}: {
  categoryId?: string;
  onClose: () => void;
}) {
  const { data: categories = [] } = useMenuCategories();
  const { mutate: addItem, isPending } = useAddMenuItem();
  const [form, setForm] = useState<ItemFormState>({
    ...EMPTY_FORM,
    categoryId: defaultCategoryId ?? "",
  });

  function set<K extends keyof ItemFormState>(
    field: K,
    value: ItemFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleTag(tag: DietaryTag) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = Math.round(Number.parseFloat(form.price) * 100);
    if (!form.name || !form.categoryId || Number.isNaN(priceNum)) {
      toast.error("Please fill in required fields");
      return;
    }
    addItem(
      {
        categoryId: BigInt(form.categoryId),
        name: form.name,
        description: form.description,
        price: BigInt(priceNum),
        imageUrl: form.imageUrl,
        tags: form.tags,
        calories: form.calories ? BigInt(form.calories) : null,
      },
      {
        onSuccess: () => {
          toast.success(`${form.name} added to menu`);
          onClose();
        },
        onError: () => toast.error("Failed to add item"),
      },
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-card border border-primary/20 rounded-2xl p-6 mb-6 shadow-gold-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display italic text-lg text-foreground">
          Add New Menu Item
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground"
          data-ocid="menu.add_form.close_button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="item-name"
              className="text-xs text-muted-foreground mb-1 block"
            >
              Name *
            </label>
            <Input
              id="item-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Truffle Risotto"
              className="bg-secondary border-border h-9"
              data-ocid="menu.add_form.name_input"
            />
          </div>
          <div>
            <label
              htmlFor="item-category"
              className="text-xs text-muted-foreground mb-1 block"
            >
              Category *
            </label>
            <select
              id="item-category"
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="w-full h-9 rounded-md bg-secondary border border-border text-sm text-foreground px-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-ocid="menu.add_form.category_select"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="item-description"
            className="text-xs text-muted-foreground mb-1 block"
          >
            Description
          </label>
          <textarea
            id="item-description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A brief description of the dish..."
            rows={2}
            className="w-full rounded-md bg-secondary border border-border text-sm text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none placeholder:text-muted-foreground"
            data-ocid="menu.add_form.description_textarea"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="item-price"
              className="text-xs text-muted-foreground mb-1 block"
            >
              Price ($) *
            </label>
            <Input
              id="item-price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="24.99"
              className="bg-secondary border-border h-9"
              data-ocid="menu.add_form.price_input"
            />
          </div>
          <div>
            <label
              htmlFor="item-calories"
              className="text-xs text-muted-foreground mb-1 block"
            >
              Calories
            </label>
            <Input
              id="item-calories"
              type="number"
              min="0"
              value={form.calories}
              onChange={(e) => set("calories", e.target.value)}
              placeholder="420"
              className="bg-secondary border-border h-9"
              data-ocid="menu.add_form.calories_input"
            />
          </div>
          <div>
            <label
              htmlFor="item-image"
              className="text-xs text-muted-foreground mb-1 block"
            >
              Image URL
            </label>
            <Input
              id="item-image"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://..."
              className="bg-secondary border-border h-9"
              data-ocid="menu.add_form.image_input"
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Dietary Tags</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs border transition-smooth ${
                  form.tags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border hover:border-primary/40"
                }`}
                data-ocid={`menu.add_form.tag.${tag}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-smooth"
            data-ocid="menu.add_form.cancel_button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth disabled:opacity-50 flex items-center gap-2"
            data-ocid="menu.add_form.submit_button"
          >
            <Check className="w-4 h-4" />
            {isPending ? "Adding..." : "Add Item"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function MenuItemRow({
  item,
  categoryName,
  index,
}: {
  item: MenuItem;
  categoryName: string;
  index: number;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editPrice, setEditPrice] = useState(String(Number(item.price) / 100));
  const { mutate: updateItem, isPending: isUpdating } = useUpdateMenuItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteMenuItem();
  const { mutate: toggle, isPending: isToggling } = useToggleItemAvailability();

  function saveEdit() {
    const priceNum = Math.round(Number.parseFloat(editPrice) * 100);
    if (Number.isNaN(priceNum)) return;
    updateItem(
      { ...item, name: editName, price: BigInt(priceNum) },
      {
        onSuccess: () => {
          toast.success("Item updated");
          setEditing(false);
        },
        onError: () => toast.error("Failed to update"),
      },
    );
  }

  function handleDelete() {
    deleteItem(item.id, {
      onSuccess: () => toast.success(`${item.name} deleted`),
      onError: () => toast.error("Failed to delete"),
    });
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-smooth ${
        item.isAvailable
          ? "bg-card border-border"
          : "bg-secondary/30 border-border/40 opacity-60"
      }`}
      data-ocid={`menu.item.${index + 1}`}
    >
      {/* Image thumbnail */}
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 min-w-0 bg-secondary border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-ocid={`menu.edit_name.${index + 1}`}
            />
            <input
              type="number"
              step="0.01"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-20 bg-secondary border border-border rounded-lg px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              data-ocid={`menu.edit_price.${index + 1}`}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-foreground text-sm truncate">
              {item.name}
            </span>
            <PriceDisplay
              cents={item.price}
              className="text-xs text-primary font-semibold"
            />
            <span className="text-xs text-muted-foreground">
              {categoryName}
            </span>
            {item.tags.slice(0, 2).map((tag) => (
              <DietaryBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {editing ? (
          <>
            <button
              type="button"
              onClick={saveEdit}
              disabled={isUpdating}
              className="p-1.5 rounded-lg bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 transition-smooth disabled:opacity-50"
              data-ocid={`menu.save_button.${index + 1}`}
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground"
              data-ocid={`menu.edit_cancel.${index + 1}`}
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground hover:text-foreground"
              data-ocid={`menu.edit_button.${index + 1}`}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              disabled={isToggling}
              className="p-1.5 rounded-lg hover:bg-secondary transition-smooth text-muted-foreground hover:text-foreground disabled:opacity-50"
              title={item.isAvailable ? "Disable item" : "Enable item"}
              data-ocid={`menu.toggle_button.${index + 1}`}
            >
              {item.isAvailable ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 rounded-lg hover:bg-red-900/30 transition-smooth text-muted-foreground hover:text-red-400 disabled:opacity-50"
              data-ocid={`menu.delete_button.${index + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function MenuManager() {
  const { data: items = [], isLoading } = useMenuItems();
  const { data: categories = [] } = useMenuCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categoryMap = new Map(categories.map((c) => [String(c.id), c]));

  const filtered = items.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || String(item.categoryId) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 h-full overflow-auto" data-ocid="menu.panel">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display italic text-2xl text-foreground">
            Menu Manager
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth"
          data-ocid="menu.add_item_button"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="pl-9 bg-secondary border-border h-9"
            data-ocid="menu.search_input"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs transition-smooth ${
              categoryFilter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="menu.filter.all"
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={String(c.id)}
              type="button"
              onClick={() => setCategoryFilter(String(c.id))}
              className={`px-3 py-1.5 rounded-lg text-xs transition-smooth ${
                categoryFilter === String(c.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`menu.filter.${String(c.id)}`}
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAddForm && (
          <AddItemForm
            categoryId={categoryFilter !== "all" ? categoryFilter : undefined}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center h-48 text-center"
          data-ocid="menu.empty_state"
        >
          <UtensilsCrossed className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-foreground font-medium">
            {search || categoryFilter !== "all"
              ? "No matching items"
              : "No menu items yet"}
          </p>
          {!search && categoryFilter === "all" && (
            <p className="text-muted-foreground text-sm mt-1">
              Click "Add Item" to get started
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((item, i) => (
              <MenuItemRow
                key={String(item.id)}
                item={item}
                categoryName={
                  categoryMap.get(String(item.categoryId))?.name ?? ""
                }
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
