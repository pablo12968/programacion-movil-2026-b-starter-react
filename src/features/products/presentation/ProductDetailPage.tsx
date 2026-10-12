import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBackOutline, createOutline, trashOutline, cubeOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getErrorMessage } from '../data/api-error';
import { deleteProduct, getProduct } from '../data/products-api';
import { toProductView } from '../domain/product';
import type { Product } from '../domain/product';
import EmptyState from './EmptyState';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (location.pathname !== `/productos/${id}`) return;
    let isActive = true;
    setIsLoading(true); setErrorMessage(''); setIsConfirming(false); setDeleteError('');
    getProduct(Number(id)).then((item) => { if (isActive) setProduct(item); })
      .catch((error: unknown) => { if (isActive) setErrorMessage(getErrorMessage(error)); })
      .finally(() => { if (isActive) setIsLoading(false); });
    return () => { isActive = false; };
  }, [id, location, retry]);

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true); setDeleteError('');
    try { await deleteProduct(Number(id)); history.replace('/productos'); }
    catch (error) { setDeleteError(getErrorMessage(error)); }
    finally { setIsDeleting(false); }
  }
  const view = product ? toProductView(product) : null;

  return <IonPage>
    <IonHeader className="app-header"><IonToolbar><IonTitle>Detalle del producto</IonTitle></IonToolbar></IonHeader>
    <IonContent><main className="catalog-shell narrow-shell">
      <IonButton fill="clear" className="back-link" onClick={() => history.push('/productos')}><IonIcon icon={arrowBackOutline} slot="start" />Volver al catálogo</IonButton>
      {isLoading ? <div className="state-panel" role="status"><IonSpinner /><p>Cargando producto…</p></div>
        : errorMessage ? <div className="state-panel" role="alert"><EmptyState title="No se pudo abrir el producto" message={errorMessage} actionLabel="Reintentar" onAction={() => setRetry((value) => value + 1)} /></div>
        : view && <article className="detail-panel">
          <div className={`detail-art category-${view.category.toLowerCase()}`} aria-hidden="true"><IonIcon icon={cubeOutline} /><span>ESTANTE / {String(view.id).padStart(2, '0')}</span></div>
          <div className="detail-body"><p className="eyebrow">{view.category} / PRODUCTO #{view.id}</p><h1>{view.name}</h1><p className="detail-price">{view.priceLabel}</p>
            <dl className="product-facts"><div><dt>Identificador</dt><dd>#{view.id}</dd></div><div><dt>Categoría</dt><dd>{view.category}</dd></div><div><dt>Existencias</dt><dd>{view.stock} unidades</dd></div><div><dt>Disponibilidad</dt><dd><span className={`stock-label ${view.isOutOfStock ? 'stock-empty' : view.isLowStock ? 'stock-low' : 'stock-ok'}`}>{view.stockLabel}</span></dd></div></dl>
            <div className="detail-actions"><IonButton disabled={isDeleting} onClick={() => history.push(`/productos/${id}/editar`)}><IonIcon icon={createOutline} slot="start" />Editar</IonButton><IonButton color="danger" fill="outline" disabled={isDeleting} onClick={() => setIsConfirming(true)}><IonIcon icon={trashOutline} slot="start" />Eliminar</IonButton></div>
            {isConfirming && <section className="delete-confirm" role="alert" aria-label="Confirmar eliminación"><h2>¿Eliminar este producto?</h2><p>Se eliminará «{view.name}» del inventario. Esta acción no se puede deshacer.</p><div className="detail-actions"><IonButton color="danger" disabled={isDeleting} onClick={() => void handleDelete()}>{isDeleting ? 'Eliminando…' : 'Confirmar eliminación'}</IonButton><IonButton fill="outline" disabled={isDeleting} onClick={() => { setIsConfirming(false); setDeleteError(''); }}>Cancelar</IonButton></div></section>}
            {deleteError && <p className="error-banner" role="alert">{deleteError}</p>}
          </div>
        </article>}
    </main></IonContent>
  </IonPage>;
};
export default ProductDetailPage;
