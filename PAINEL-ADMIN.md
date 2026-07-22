# Painel administrativo da Epinte

O site usa o Pages CMS para permitir que uma pessoa autorizada edite produtos, imagens e alguns textos sem alterar código.

## Ativação inicial

1. Envie este projeto para o repositório GitHub configurado como `origin`.
2. Acesse `/admin/` no domínio publicado ou abra https://app.pagescms.org/.
3. Clique em entrar com GitHub.
4. Instale o aplicativo Pages CMS somente no repositório da Epinte.
5. Abra o repositório `epinte` e selecione a branch `main`.
6. O painel carregará automaticamente a configuração do arquivo `.pages.yml`.

O Pages CMS grava as alterações diretamente no GitHub. Para o site atualizar sozinho, a hospedagem precisa estar conectada ao mesmo repositório e fazer uma nova publicação após cada commit.

## Adicionar um produto

1. Abra **Produtos e coleções**.
2. Escolha a coleção desejada: animais, letras e números ou imaginação e aventura.
3. Abra **Produtos** e clique para adicionar um item.
4. Preencha:
   - **Identificador:** único, sem espaços e sem acentos. Exemplo: `painel-leao`.
   - **Nome:** nome exibido no catálogo. Exemplo: `Mini Painel Leão`.
   - **Enviar imagem:** envia PNG, JPG ou WebP para o próprio site.
   - **URL externa da imagem:** alternativa para usar uma imagem hospedada em outro serviço.
   - **Categoria curta:** exemplo: `Fauna`.
   - **Descrição:** texto apresentado ao abrir o produto.
5. Salve a alteração.

É necessário preencher **Enviar imagem** ou **URL externa da imagem**. Quando os dois campos estiverem preenchidos, a URL externa será usada.

## Exemplo de produto

- Identificador: `painel-leao`
- Nome: `Mini Painel Leão`
- URL externa da imagem: `https://exemplo.com/imagens/painel-leao.webp`
- Categoria curta: `Fauna`
- Descrição: `Mini painel de leão em EPS, pronto para pintar e personalizar.`
- Tamanhos: `20 x 20 cm`

A URL externa precisa ser pública, começar com `https://` e apontar diretamente para uma imagem. Links de páginas do Google Drive, Instagram e outros sites podem não funcionar como imagem direta.

## Editar frases

1. Abra **Textos editáveis do site**.
2. Altere somente o campo desejado.
3. Salve e aguarde a nova publicação da hospedagem.

## Cuidados

- Não reutilize o mesmo identificador em dois produtos.
- Prefira imagens WebP ou JPG otimizadas para o site carregar rapidamente.
- Evite arquivos muito grandes; para os cards, normalmente até 1600 px é suficiente.
- Não exclua as coleções principais pelo editor do GitHub.
- O login e as permissões são controlados pelo GitHub; nenhuma senha fica gravada no código do site.
