# Catálogo Epinte

O arquivo `catalog.json` funciona como o banco de dados local do catálogo.

Para cadastrar um produto:

1. Coloque a imagem em `assets/products/`.
2. Adicione o produto no array `products` da coleção desejada.
3. Use um `id` único, sem espaços.

Campos opcionais:

- `specs`: sobrescreve material, tamanhos ou acabamento padrão.
- `purchase.mercadoLivre`: link direto do produto no Mercado Livre.
- `purchase.amazon`: link direto do produto na Amazon.
- `purchase.direct`: link para pedir o produto diretamente.
- `purchase.wholesale`: link para comprar no atacado.

Quando houver um banco de dados ou API, basta trocar o método
`catalogRepository.getCatalog()` em `js/main.js`. O restante da interface
continua usando a mesma estrutura de dados.
