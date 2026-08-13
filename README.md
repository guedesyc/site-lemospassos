# Site LemosPassos

Protótipo do novo site institucional do Grupo LemosPassos.

## Estrutura

- `index.html`: abertura animada com a assinatura "acima de tudo, o cuidado".
- `home.html`: página inicial com apresentação do grupo, números, mapa de atuação e empresas parceiras.
- `solucoes.html`: lista de frentes de atuação.
- `solucao-*.html`: páginas internas de cada solução.
- `trabalhe-conosco.html`: formulário de envio de currículo via e-mail.
- `contato.html`: formulário de contato e endereços.
- `noticias.html`: carrossel de notícias editável pelo painel.
- `lgpd.html`: central de links e informações de privacidade.
- `admin.html` / `admin.js`: painel local para editar indicadores, imagens por categoria e notícias.
- `styles.css`: estilos, responsividade e animações.
- `script.js`: transições entre páginas, contador animado, cards interativos e formulários.
- `local-server.mjs`: servidor local simples para teste.
- `assets/`: imagens, identidade visual e mapa vetorial usado nas páginas. As fotos de cada solução, contato e cards ficam centralizadas nesta pasta com nomes normalizados para facilitar o carregamento.

## Como testar

Abra `index.html` no navegador ou rode:

```bash
node local-server.mjs
```

Depois acesse `http://127.0.0.1:5174`.

## Observações

O site é estático e não possui etapa de build. Os formulários usam `mailto`, então o envio final depende do cliente de e-mail do usuário.

O painel administrativo desta versão é um protótipo local: usuário `admin`, senha `Lemos2@30!`. Os dados ficam salvos no `localStorage` do navegador; imagens escolhidas pelo seletor são convertidas em dados incorporados, para não dependerem da pasta `assets` do computador que fez o upload. Isso ainda não constitui autenticação segura para produção: para uso real, será necessário conectar o painel a um backend com autenticação e banco de dados.
## Conteudo administravel

O painel permite editar os indicadores da home, organizar empresas nas categorias Hospitalar, Restaurantes, Area de Seguranca e Merenda Escolar e cadastrar noticias com resumo, corpo completo e anexos de imagem. As noticias abrem dentro do proprio site, em `noticias.html`.
