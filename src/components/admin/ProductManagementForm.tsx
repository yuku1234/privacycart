import React, { useState, useEffect } from 'react';
import { Plus, Edit3, ShieldCheck, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { dataService } from '../../lib/dataService';

interface ProductManagementFormProps {
  productToEdit: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProductManagementForm: React.FC<ProductManagementFormProps> = ({
  productToEdit,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Privacy Hardware');
  const [price, setPrice] = useState<number>(999);
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [inStock, setInStock] = useState(true);
  const [privacyBadge, setPrivacyBadge] = useState<Product['privacyBadge']>('Zero Telemetry');
  const [dataRequiredDescription, setDataRequiredDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setDescription(productToEdit.description);
      setFeatures(productToEdit.features.join(', '));
      setInStock(productToEdit.inStock);
      setPrivacyBadge(productToEdit.privacyBadge);
      setDataRequiredDescription(productToEdit.dataRequiredDescription);
      setImageUrl(productToEdit.imageUrl);
    } else {
      setName('');
      setCategory('Privacy Hardware');
      setPrice(1299);
      setDescription('');
      setFeatures('Zero Telemetry, Hardware Protected, Open Standard');
      setInStock(true);
      setPrivacyBadge('Zero Telemetry');
      setDataRequiredDescription('Shipping address and recipient name required for physical transit. Operates offline.');
      setImageUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !description.trim() || !dataRequiredDescription.trim()) {
      error('Incomplete Details', 'Please provide product name, description, and privacy disclosure.');
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedFeatures = features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      if (productToEdit) {
        await dataService.updateProduct(
          {
            ...productToEdit,
            name,
            category,
            price: Number(price),
            description,
            features: parsedFeatures,
            inStock,
            privacyBadge,
            dataRequiredDescription,
            imageUrl: imageUrl || productToEdit.imageUrl,
          },
          user.role
        );
        success('Catalog Updated', `Updated product: ${name}`);
      } else {
        await dataService.addProduct(
          {
            name,
            category,
            price: Number(price),
            description,
            features: parsedFeatures,
            inStock,
            rating: 5.0,
            privacyBadge,
            dataRequiredDescription,
            imageUrl:
              imageUrl ||
              'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
          },
          user.role
        );
        success('Product Added', `New item added to catalog: ${name}`);
      }

      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error('Operation Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product & Privacy Notice' : 'Add New Privacy Product'}
      subtitle="Administrator Catalog Management Desk"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Product['category'])}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            >
              <option value="Privacy Hardware">Privacy Hardware</option>
              <option value="Security Devices">Security Devices</option>
              <option value="Books & Guides">Books & Guides</option>
              <option value="Everyday Tech">Everyday Tech</option>
              <option value="Software Licenses">Software Licenses</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Price in INR (₹) *
            </label>
            <input
              type="number"
              required
              min={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Privacy Certification Badge
            </label>
            <select
              value={privacyBadge}
              onChange={(e) => setPrivacyBadge(e.target.value as Product['privacyBadge'])}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            >
              <option value="Zero Telemetry">Zero Telemetry</option>
              <option value="Minimal Data">Minimal Data</option>
              <option value="Encrypted">Encrypted</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
              <span className="font-semibold text-xs">Mark as In Stock</span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Product Description *
          </label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Features (Comma-separated)
          </label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
          />
        </div>

        {/* DPDP Section 5 Itemised Data Disclosure for this product */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
          <label className="block text-[11px] font-bold text-indigo-950">
            DPDP Section 5: Itemised Personal Data Notice for this Product *
          </label>
          <textarea
            required
            rows={2}
            value={dataRequiredDescription}
            onChange={(e) => setDataRequiredDescription(e.target.value)}
            placeholder="Specify what exact personal data is collected for order dispatch of this product..."
            className="w-full text-xs p-2.5 bg-white border border-indigo-200 rounded-lg text-slate-900"
          />
          <span className="text-[10px] text-indigo-700 block">
            This notice is displayed to shoppers in the product modal and at checkout.
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Create Product'}</span>
          </button>
        </div>

      </form>
    </Modal>
  );
};
