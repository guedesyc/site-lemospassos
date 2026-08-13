const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "Lemos2@30!";
const CMS_KEY = "lemospassos-cms-v1";
const categories = ["Hospitalar", "Restaurantes", "Área de Segurança", "Merenda Escolar"];
const defaults = { metrics: { meals: 400000, employees: 3500, restaurants: 431 }, partners: { Hospitalar: ["./assets/hospitalar.jpg", "./assets/equipe-lemospassos.jpg"], Restaurantes: ["./assets/populares.jpg", "./assets/20260225_113909.jpg.jpg"], "Área de Segurança": ["./assets/complexos.jpg", "./assets/facilities.jpg"], "Merenda Escolar": ["./assets/educacional.jpg", "./assets/hotelaria.jpg"] }, news: [{ title: "Relatório de Transparência e Igualdade Salarial de Mulheres e Homens", excerpt: "Confira o relatório institucional disponibilizado pelo Grupo LemosPassos.", image: "./assets/contato.jpg", url: "https://www.lemospassos.com.br/relatorio-de-transparencia-e-igualdade-salarial-de-mulheres-e-homens/" }, { title: "60 anos da Administração", excerpt: "Uma homenagem à história, à ética e à boa gestão.", image: "./assets/card-atuacoes.jpg", url: "https://www.lemospassos.com.br/60-anos-da-administracao/" }, { title: "Dia do Cliente", excerpt: "A confiança nasce nos gestos diários e se fortalece em cada etapa.", image: "./assets/card-contatos.jpg", url: "https://www.lemospassos.com.br/dia-do-cliente-2/" }, { title: "Dica da Nutri", excerpt: "Um prato colorido mostra a diversidade de nutrientes.", image: "./assets/populares.jpg", url: "https://www.lemospassos.com.br/dica-da-nutri-2/" }] };
const getData = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(CMS_KEY) || "{}") }; } catch { return defaults; } };
const saveData = (data) => localStorage.setItem(CMS_KEY, JSON.stringify(data));
const login = document.querySelector("[data-admin-login]");
const panel = document.querySelector("[data-admin-panel]");
const form = document.querySelector("[data-cms-form]");
const editor = document.querySelector("[data-partner-editor]");
const newsEditor = document.querySelector("[data-news-editor]");

function render(data) {
  form.meals.value = data.metrics.meals; form.employees.value = data.metrics.employees; form.restaurants.value = data.metrics.restaurants;
  editor.innerHTML = categories.map((category) => `<fieldset class="admin-fieldset"><legend>${category}</legend><div class="admin-image-list" data-category="${category}">${(data.partners[category] || []).map((url) => `<div class="admin-image-row"><input value="${url}" data-image-url /><button type="button" data-remove-image>Remover</button></div>`).join("")}</div><button type="button" class="admin-small-button" data-add-image data-category="${category}">+ Adicionar imagem</button></fieldset>`).join("");
  newsEditor.innerHTML = (data.news || []).map((item, index) => `<fieldset class="admin-fieldset" data-news-index="${index}"><legend>Notícia ${index + 1}</legend><label>Título<input value="${item.title || ""}" data-news-title /></label><label>Resumo<textarea data-news-excerpt>${item.excerpt || ""}</textarea></label><label>Imagem<input value="${item.image || ""}" data-news-image /></label><label>Link<input value="${item.url || ""}" data-news-url /></label><button type="button" class="admin-small-button" data-remove-news>Remover notícia</button></fieldset>`).join("");
}

function readData() {
  const data = getData();
  data.metrics = { meals: Number(form.meals.value), employees: Number(form.employees.value), restaurants: Number(form.restaurants.value) };
  data.partners = Object.fromEntries(categories.map((category) => [category, [...document.querySelectorAll(`[data-category="${category}"] [data-image-url]`)].map((input) => input.value.trim()).filter(Boolean)]));
  data.news = [...document.querySelectorAll("[data-news-index]")].map((box) => ({ title: box.querySelector("[data-news-title]").value.trim(), excerpt: box.querySelector("[data-news-excerpt]").value.trim(), image: box.querySelector("[data-news-image]").value.trim(), url: box.querySelector("[data-news-url]").value.trim() })).filter((item) => item.title);
  return data;
}

document.querySelector("[data-admin-login-form]").addEventListener("submit", (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get("username") === ADMIN_USER && data.get("password") === ADMIN_PASSWORD) { sessionStorage.setItem("lemospassos-admin", "1"); login.classList.add("is-hidden"); panel.classList.remove("is-hidden"); render(getData()); } else document.querySelector("[data-admin-error]").textContent = "Usuário ou senha inválidos."; });
document.querySelector("[data-admin-logout]").addEventListener("click", () => { sessionStorage.removeItem("lemospassos-admin"); panel.classList.add("is-hidden"); login.classList.remove("is-hidden"); });
document.querySelector("[data-add-news]").addEventListener("click", () => { const data = getData(); data.news.push({ title: "", excerpt: "", image: "./assets/hero-kitchen.png", url: "#" }); render(data); });
editor.addEventListener("click", (event) => { if (event.target.matches("[data-remove-image]")) event.target.closest(".admin-image-row").remove(); if (event.target.matches("[data-add-image]")) { const box = document.querySelector(`[data-category="${event.target.dataset.category}"]`); box.insertAdjacentHTML("beforeend", '<div class="admin-image-row"><input placeholder="URL ou caminho da imagem" data-image-url /><input type="file" accept="image/*" data-image-file /><button type="button" data-remove-image>Remover</button></div>'); } });
editor.addEventListener("change", (event) => { if (!event.target.matches("[data-image-file]") || !event.target.files[0]) return; const reader = new FileReader(); reader.onload = () => { event.target.closest(".admin-image-row").querySelector("[data-image-url]").value = reader.result; }; reader.readAsDataURL(event.target.files[0]); });
newsEditor.addEventListener("click", (event) => { if (event.target.matches("[data-remove-news]")) event.target.closest("[data-news-index]").remove(); });
form.addEventListener("submit", (event) => { event.preventDefault(); saveData(readData()); document.querySelector("[data-admin-success]").textContent = "Alterações salvas neste navegador."; setTimeout(() => document.querySelector("[data-admin-success]").textContent = "", 3500); });
if (sessionStorage.getItem("lemospassos-admin") === "1") { login.classList.add("is-hidden"); panel.classList.remove("is-hidden"); render(getData()); }
