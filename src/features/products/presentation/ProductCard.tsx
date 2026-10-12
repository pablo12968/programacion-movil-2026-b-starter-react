import { IonButton, IonCard, IonIcon } from '@ionic/react';
import { arrowForwardOutline, cafeOutline, cubeOutline, homeOutline, sparklesOutline } from 'ionicons/icons';
import type { ProductView } from '../domain/product';

export interface ProductCardProps {
  product: ProductView;
  onSelect?: (id: number) => void;
}
const CATEGORY_ICONS: Record<string, string> = { Bebidas: cafeOutline, Snacks: cubeOutline, Aseo: sparklesOutline, Hogar: homeOutline };

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => (
  <IonCard className="product-card">
    <div className={`product-art category-${product.category.toLowerCase()}`} aria-hidden="true">
      <IonIcon icon={CATEGORY_ICONS[product.category] ?? cubeOutline} />
      <span className="art-index">{String(product.id).padStart(2, '0')}</span>
    </div>
    <div className="product-card-body">
      <span className="eyebrow">{product.category}</span>
      <h2>{product.name}</h2>
      <p className="product-price">{product.priceLabel}</p>
      <div className="stock-row">
        <span className={`stock-label ${product.isOutOfStock ? 'stock-empty' : product.isLowStock ? 'stock-low' : 'stock-ok'}`}>
          <span aria-hidden="true">● </span>{product.stockLabel}
        </span>
        <span>{product.stock} uds.</span>
      </div>
      <IonButton expand="block" fill="clear" className="card-action" onClick={() => onSelect?.(product.id)} aria-label={`Ver ${product.name}`}>
        Ver producto <IonIcon icon={arrowForwardOutline} slot="end" />
      </IonButton>
    </div>
  </IonCard>
);
export default ProductCard;
