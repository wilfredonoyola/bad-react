import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.API_URL;

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Bearer ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: page =>
    requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

const Employee = {
  get: () =>
  requests.get(`/Empleadoes`),
  all: id =>
    requests.get(`/Empleadoes/${id}`),
  current: () =>
    requests.get('/user'),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  create: (employee) =>
    requests.post('/Empleadoes',  employee ),
  save: user =>
    requests.put('/user', { user })
};

const Roles = {
  all: () =>
    requests.get(`/Rols`),
  current: () =>
    requests.get('/user'),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  create: (employee) =>
    requests.post('/Empleadoes',  employee ),
  save: user =>
    requests.put('/user', { user })
};

const Users = {
  all: () =>
    requests.get(`/Usuarios`),
  get: (id) =>
    requests.get(`/Usuarios/${id}`),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  create: (employee) =>
    requests.post('/Empleadoes',  employee ),
  save: user =>
    requests.put('/user', { user }),
  addRole: (id, payload) =>
    requests.post(`/Usuarios/AgregarRoles/${id}`, payload),
  removeRole: (id, payload) =>
    requests.put(`/Usuarios/QuitarRoles/${id}`, payload)
};

const Companies = {
  all: () =>
    requests.get(`/Usuarios`),
  get: (id) =>
    requests.get(`/Usuarios/${id}`),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  createGovernmentInstitution: (institution) =>
    requests.post('/InstitucionGubernamentals',  institution ),
  save: user =>
    requests.put('/user', { user }),
  addRole: (id, payload) =>
    requests.post(`/Usuarios/AgregarRoles/${id}`, payload),
  removeRole: (id, payload) =>
    requests.put(`/Usuarios/QuitarRoles/${id}`, payload)
};

const Products = {
  all: () =>
    requests.get(`/Productoes`),
  getCompanyProvider: () =>
    requests.get(`/EmpresaProveedoras`),
  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  create: (product) =>
    requests.post('/Productoes',  product ),
  save: user =>
    requests.put('/user', { user }),
  addRole: (id, payload) =>
    requests.post(`/Usuarios/AgregarRoles/${id}`, payload),
  removeRole: (id, payload) =>
    requests.put(`/Usuarios/QuitarRoles/${id}`, payload)
};

const Shopping = {
  all: () =>
    requests.get(`/Compras`),
  getCompanyProviderAuthorized: () =>
    requests.get(`/EmpresaProveedoras/AutorizadasVender`),
  getCompanyProviderAuthorizedInstall: () =>
    requests.get(`/EmpresaProveedoras/AutorizadasInstalar`),
  getShiftInstallation: (id) =>
    requests.get(`/EmpresaProveedoras/EmpleadosInstalacion/${id}`),
  getShiftMaintenance: (id) =>
    requests.get(`/EmpresaProveedoras/EmpleadosMantenimiento/${id}`),

  login: (email, password) =>{
    return requests.post('/users/login', { user: { email, password } })},
  create: (product) =>
    requests.post('/Productoes',  product ),
  buy: (buy) =>
    requests.post('/Compras',  buy ),
  save: user =>
    requests.put('/user', { user }),
  addRole: (id, payload) =>
    requests.post(`/Usuarios/AgregarRoles/${id}`, payload),
  removeRole: (id, payload) =>
    requests.put(`/Usuarios/QuitarRoles/${id}`, payload)
};

export default {
  Shopping,
  Products,
  Users,
  Employee,
  Companies,
  Roles,
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};