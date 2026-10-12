import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { addOutline, gridOutline, searchOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getErrorMessage } from '../data/api-error';
import { getProducts } from '../data/products-api';
import { CATEGORIES, filterProducts, toProductView } from '../domain/product';
import type { Product } from '../domain/product';
import EmptyState from './EmptyState';
import ProductCard from './ProductCard';

const ProductListPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [retry, setRetry] = useState(0);

  // La ubicación cambia al volver a una página retenida por Ionic.
  useEffect(() => {
    if (location.pathname !== '/productos') return;
    let isActive = true;
    setStatus('loading');
    getProducts().then((items) => {
      if (isActive) { setProducts(items); setStatus('ready'); }
    }).catch((error: unknown) => {
      if (isActive) { setErrorMessage(getErrorMessage(error)); setStatus('error'); }
    });
    return () => { isActive = false; };
  }, [location, retry]);

  const filtered = filterProducts(products, { search, category });
  const clearFilters = () => { setSearch(''); setCategory(''); };

  return (
    <IonPage>
      <IonHeader className="app-header"><IonToolbar>
        <IonTitle><span className="brand"><IonIcon icon={gridOutline} /> estante<span className="brand-dot">.</span></span></IonTitle>
        <span slot="end" className="header-note">TU CATÁLOGO, EN ORDEN</span>
      </IonToolbar></IonHeader>
      <IonContent>
        <main className="catalog-shell">
          <section className="catalog-heading">
            <div><p className="eyebrow">INVENTARIO / PRODUCTOS</p><h1>Un lugar para<br /><span>cada producto.</span></h1>
              <p className="intro">Consulta, organiza y mantén al día tu inventario.</p></div>
            <IonButton className="primary-cta" onClick={() => history.push('/productos/nuevo')}><IonIcon icon={addOutline} slot="start" />Nuevo producto</IonButton>
          </section>
          <section className="catalog-controls" aria-label="Filtros del catálogo">
            <div className="search-field"><IonIcon icon={searchOutline} aria-hidden="true" /><IonInput aria-label="Buscar productos" placeholder="Buscar por nombre…" value={search} onIonInput={(event) => setSearch(String(event.detail.value ?? ''))} /></div>
            <div className="category-filters">
              {['', ...CATEGORIES].map((item) => <IonButton key={item} fill={category === item ? 'solid' : 'clear'} aria-pressed={category === item} onClick={() => setCategory(item)}>{item || 'Todas'}</IonButton>)}
            </div>
          </section>
          {status === 'loading' && <div className="state-panel" role="status"><IonSpinner name="crescent" /><p>Cargando productos…</p></div>}
          {status === 'error' && <div className="state-panel" role="alert"><EmptyState title="No se pudo cargar" message={errorMessage} actionLabel="Reintentar" onAction={() => setRetry((value) => value + 1)} /></div>}
          {status === 'ready' && <>
            <div className="results-heading"><h2>{category || 'Todos los productos'}</h2><span aria-live="polite">{filtered.length} de {products.length} productos</span></div>
            {products.length === 0 ? <div className="state-panel"><EmptyState title="Tu inventario está vacío" message="Agrega tu primer producto para comenzar." actionLabel="Crear producto" onAction={() => history.push('/productos/nuevo')} /></div>
              : filtered.length === 0 ? <div className="state-panel"><EmptyState title="Sin resultados" message="Prueba con otro nombre o categoría." actionLabel="Limpiar filtros" onAction={clearFilters} /></div>
              : <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={toProductView(product)} onSelect={(id) => history.push(`/productos/${id}`)} />)}</div>}
          </>}
          <footer className="catalog-footer"><span>estante. / Catálogo de productos</span><span>Hecho para tener todo a mano.</span></footer>
        </main>
      </IonContent>
    </IonPage>
  );
};
export default ProductListPage;
