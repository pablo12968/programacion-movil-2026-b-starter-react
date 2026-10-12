import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBackOutline, checkmarkOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ApiError, getErrorMessage } from '../data/api-error';
import { createProduct, getProduct, updateProduct } from '../data/products-api';
import { CATEGORIES, validateProduct } from '../domain/product';
import type { ProductField, ProductInput } from '../domain/product';
import EmptyState from './EmptyState';

const EMPTY_VALUES = { name: '', price: '', category: '', stock: '' };
const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = id !== undefined;
  const history = useHistory();
  const location = useLocation();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<ProductField, boolean>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [serverDetails, setServerDetails] = useState<string[]>([]);
  const [retry, setRetry] = useState(0);
  const backPath = isEditing ? `/productos/${id}` : '/productos';

  useEffect(() => {
    if (location.pathname !== (isEditing ? `/productos/${id}/editar` : '/productos/nuevo')) return;
    let isActive = true;
    setValues(EMPTY_VALUES); setTouched({}); setIsSubmitted(false); setSaveError(''); setServerDetails([]); setLoadError('');
    if (!isEditing) { setIsLoading(false); return; }
    setIsLoading(true);
    getProduct(Number(id)).then((product) => {
      if (isActive) setValues({ name: product.name, price: String(product.price), category: product.category, stock: String(product.stock) });
    }).catch((error: unknown) => { if (isActive) setLoadError(getErrorMessage(error)); })
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, [id, isEditing, location, retry]);

  const input: ProductInput = { ...values, price: values.price.trim() ? Number(values.price) : NaN, stock: values.stock.trim() ? Number(values.stock) : NaN };
  const validation = validateProduct(input);
  const errorFor = (field: ProductField) => (isSubmitted || touched[field]) ? validation.errors[field] : undefined;
  function change(field: ProductField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
    setSaveError(''); setServerDetails([]);
  }
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); setIsSubmitted(true);
    if (!validation.isValid || isSaving) return;
    setIsSaving(true); setSaveError(''); setServerDetails([]);
    try {
      const product = isEditing ? await updateProduct(Number(id), input) : await createProduct(input);
      history.replace(`/productos/${product.id}`);
    } catch (error) {
      setSaveError(getErrorMessage(error));
      if (error instanceof ApiError) setServerDetails(error.details);
    } finally { setIsSaving(false); }
  }

  return <IonPage>
    <IonHeader className="app-header"><IonToolbar><IonTitle>{isEditing ? 'Editar producto' : 'Nuevo producto'}</IonTitle></IonToolbar></IonHeader>
    <IonContent><main className="catalog-shell form-shell">
      <IonButton className="back-link" fill="clear" disabled={isSaving} onClick={() => history.push(backPath)}><IonIcon icon={arrowBackOutline} slot="start" />Volver</IonButton>
      {isLoading ? <div className="state-panel" role="status"><IonSpinner /><p>Cargando producto…</p></div>
        : loadError ? <div className="state-panel" role="alert"><EmptyState title="No se pudo cargar" message={loadError} actionLabel="Reintentar" onAction={() => setRetry((value) => value + 1)} /><IonButton fill="clear" onClick={() => history.push('/productos')}>Volver al catálogo</IonButton></div>
        : <section className="form-panel"><p className="eyebrow">{isEditing ? `PRODUCTO #${id}` : 'CRECE TU INVENTARIO'}</p><h1>{isEditing ? 'Actualiza los detalles.' : 'Dale lugar a algo nuevo.'}</h1><p className="intro">Todos los campos son obligatorios. El precio se expresa en pesos colombianos.</p>
          <form onSubmit={(event) => void handleSubmit(event)} noValidate>
            <div className="form-field"><IonInput label="Nombre" labelPlacement="stacked" fill="outline" placeholder="Ej. Café colombiano 500 g" value={values.name} disabled={isSaving} aria-invalid={!!errorFor('name')} aria-describedby="name-error" onIonInput={(event) => change('name', String(event.detail.value ?? ''))} /><p id="name-error" className="field-error" aria-live="polite">{errorFor('name')}</p><span className="field-hint">Máximo 60 caracteres · {values.name.length}/60</span></div>
            <div className="form-columns">{(['price', 'stock'] as const).map((field) => <div className="form-field" key={field}><IonInput label={field === 'price' ? 'Precio (COP)' : 'Stock (unidades)'} labelPlacement="stacked" fill="outline" type="number" inputmode={field === 'price' ? 'decimal' : 'numeric'} min={field === 'price' ? '0.01' : '0'} step={field === 'price' ? 'any' : '1'} placeholder={field === 'price' ? '8500' : '0'} value={values[field]} disabled={isSaving} aria-invalid={!!errorFor(field)} aria-describedby={`${field}-error`} onIonInput={(event) => change(field, String(event.detail.value ?? ''))} /><p id={`${field}-error`} className="field-error" aria-live="polite">{errorFor(field)}</p></div>)}</div>
            <fieldset className="category-field" disabled={isSaving}><legend>Categoría</legend><div className="category-filters">{CATEGORIES.map((category) => <IonButton key={category} disabled={isSaving} fill={values.category === category ? 'solid' : 'outline'} aria-pressed={values.category === category} onClick={() => change('category', category)}>{category}</IonButton>)}</div><p className="field-error" aria-live="polite">{errorFor('category')}</p></fieldset>
            {saveError && <div className="error-banner" role="alert"><strong>{saveError}</strong>{serverDetails.length > 0 && <ul>{serverDetails.map((detail, index) => <li key={index}>{detail}</li>)}</ul>}</div>}
            <div className="form-actions"><IonButton type="submit" disabled={isSaving}><IonIcon icon={checkmarkOutline} slot="start" />{isSaving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Crear producto'}</IonButton><IonButton fill="clear" disabled={isSaving} onClick={() => history.push(backPath)}>Cancelar</IonButton></div>
          </form>
        </section>}
    </main></IonContent>
  </IonPage>;
};
export default ProductFormPage;
