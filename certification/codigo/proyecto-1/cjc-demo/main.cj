import std.collection.*

main(): Int64 {
    println("=== Prueba Task 1.4: Compilacion cjc + Standard Library ===")
    
    let lista = ArrayList<String>()
    lista.add("Cangjie SDK v1.2.0")
    lista.add("Modo WSL Ubuntu")
    lista.add("Validacion Task 1.4 exitosa")

    for (item in lista) {
        println("- " + item)
    }

    return 0
}
