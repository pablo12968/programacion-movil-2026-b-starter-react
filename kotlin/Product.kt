// Modelo independiente: se puede pegar completo en Kotlin Playground.
// El id no cambia; los atributos editables usan var. Stock puede no estar informado.
class Product(
    val id: Int,
    var name: String,
    var price: Double,
    var category: String,
    var stock: Int?
)

fun stockLabel(stock: Int?): String {
    return when {
        stock == null -> "Sin dato"
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    require(price.isFinite() && price >= 0) { "El precio debe ser finito y no negativo" }
    require(percent in 0..100) { "El descuento debe estar entre 0 y 100" }
    return price * (1 - percent / 100.0)
}

fun main() {
    val products = listOf(
        Product(1, "Café colombiano", 10000.0, "Bebidas", null),
        Product(2, "Galletas de avena", 2700.0, "Snacks", 0),
        Product(3, "Jabón de manos", 6900.0, "Aseo", 3)
    )
    // Comprobaciones de límites; no agregan salidas a los tres productos solicitados.
    check(stockLabel(null) == "Sin dato")
    check(stockLabel(0) == "Agotado")
    check(stockLabel(4) == "Pocas unidades")
    check(stockLabel(5) == "Disponible")
    check(applyDiscount(10000.0, 10) == 9000.0)
    check(applyDiscount(10000.0, 0) == 10000.0)
    check(applyDiscount(10000.0, 100) == 0.0)
    for (product in products) {
        println("${product.id}. ${product.name} | ${product.category} | ${stockLabel(product.stock)} | Precio con 10% de descuento: $ ${applyDiscount(product.price, 10)}")
    }
}
