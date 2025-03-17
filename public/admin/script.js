const token = localStorage.getItem('token');
if (!token && window.location.pathname !== '/admin/login.html') window.location.href = '/admin/login.html';

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/admin';
    } else {
      document.getElementById('loginMessage').textContent = data.message || 'Login failed';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('loginMessage').textContent = 'Server error';
  }
});

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/admin/login.html';
}

function openFrontend() {
  window.open('/', '_blank');
}

function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.querySelector(`.sidebar-nav a[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

async function loadUsers(page = 1) {
  try {
    const res = await fetch(`/api/auth/users?page=${page}&limit=10`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    data.users.forEach(user => {
      userList.innerHTML += `
        <tr>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role === 'admin' ? 'Admin' : 'User'}</td>
          <td>
            <button class="edit" onclick="editUser('${user._id}')">Edit</button>
            <button class="delete" onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
    updatePagination(data.totalPages, data.currentPage, 'userPagination', loadUsers);
  } catch (err) {
    console.error(err);
    document.getElementById('userList').innerHTML = '<tr><td colspan="4">Error loading users</td></tr>';
  }
}

async function loadCategories(page = 1) {
  try {
    const res = await fetch(`/api/categories?page=${page}&limit=10`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    const categoryList = document.getElementById('categoryList');
    const categorySelect = document.getElementById('softwareCategory');
    categoryList.innerHTML = '';
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    data.categories.forEach(cat => {
      categoryList.innerHTML += `
        <tr>
          <td>${cat.name}</td>
          <td>${cat.description || 'No description'}</td>
          <td>
            <button class="edit" onclick="editCategory('${cat._id}')">Edit</button>
            <button class="delete" onclick="deleteCategory('${cat._id}')">Delete</button>
          </td>
        </tr>
      `;
      categorySelect.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
    });
    updatePagination(data.totalPages, data.currentPage, 'categoryPagination', loadCategories);
  } catch (err) {
    console.error(err);
    document.getElementById('categoryList').innerHTML = '<tr><td colspan="3">Error loading categories</td></tr>';
  }
}

async function loadSoftwares(page = 1) {
  try {
    const res = await fetch(`/api/softwares?page=${page}&limit=10`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch softwares');
    const data = await res.json();
    const softwareList = document.getElementById('softwareList');
    softwareList.innerHTML = '';
    data.softwares.forEach(soft => {
      softwareList.innerHTML += `
        <tr>
          <td>${soft.title}</td>
          <td>${soft.category?.name || 'No category'}</td>
          <td><a href="${soft.downloadLink}" target="_blank">${soft.downloadLink.slice(0, 30)}${soft.downloadLink.length > 30 ? '...' : ''}</a></td>
          <td>
            <button class="edit" onclick="editSoftware('${soft._id}')">Edit</button>
            <button class="delete" onclick="deleteSoftware('${soft._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
    updatePagination(data.totalPages, data.currentPage, 'softwarePagination', loadSoftwares);
  } catch (err) {
    console.error(err);
    document.getElementById('softwareList').innerHTML = '<tr><td colspan="4">Error loading softwares</td></tr>';
  }
}

function updatePagination(totalPages, currentPage, paginationId, loadFunction) {
  const pagination = document.getElementById(paginationId);
  pagination.innerHTML = '';
  if (totalPages > 1) {
    pagination.innerHTML += `<button onclick="${loadFunction.name}(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button onclick="${loadFunction.name}(${i})" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
    }
    pagination.innerHTML += `<button onclick="${loadFunction.name}(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
  }
}

async function editUser(id) {
  const res = await fetch('/api/auth/users', { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  const user = data.users.find(u => u._id === id);
  document.getElementById('userUsername').value = user.username;
  document.getElementById('userEmail').value = user.email;
  document.getElementById('userPassword').value = '';
  document.getElementById('userRole').value = user.role;
  document.getElementById('userForm').dataset.id = id;
}

async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    await fetch(`/api/auth/users/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    loadUsers();
  }
}

async function editCategory(id) {
  const res = await fetch(`/api/categories`, { headers: { 'Authorization': `Bearer ${token}` } });
  const data = await res.json();
  const category = data.categories.find(c => c._id === id);
  document.getElementById('categoryName').value = category.name;
  document.getElementById('categoryDesc').value = category.description || '';
  document.getElementById('categoryForm').dataset.id = id;
}

async function deleteCategory(id) {
  if (confirm('Are you sure you want to delete this category?')) {
    await fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    loadCategories();
  }
}

async function editSoftware(id) {
  const res = await fetch(`/api/softwares/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
  const soft = await res.json();
  document.getElementById('softwareTitle').value = soft.title;
  document.getElementById('softwareDesc').value = soft.description || '';
  document.getElementById('softwareCategory').value = soft.category?._id || '';
  document.getElementById('softwareLink').value = soft.downloadLink;
  document.getElementById('softwareForm').dataset.id = id;
}

async function deleteSoftware(id) {
  if (confirm('Are you sure you want to delete this software?')) {
    await fetch(`/api/softwares/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    loadSoftwares();
  }
}

document.getElementById('userForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('userUsername').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;
  const role = document.getElementById('userRole').value;
  const method = e.target.dataset.id ? 'PUT' : 'POST';
  const url = e.target.dataset.id ? `/api/auth/users/${e.target.dataset.id}` : '/api/auth/register';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ username, email, password, role })
    });
    loadUsers();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

document.getElementById('categoryForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('categoryName').value;
  const description = document.getElementById('categoryDesc').value;
  const method = e.target.dataset.id ? 'PUT' : 'POST';
  const url = e.target.dataset.id ? `/api/categories/${e.target.dataset.id}` : '/api/categories';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, description })
    });
    loadCategories();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

document.getElementById('softwareForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('softwareTitle').value;
  const description = document.getElementById('softwareDesc').value;
  const category = document.getElementById('softwareCategory').value;
  const downloadLink = document.getElementById('softwareLink').value;
  const method = e.target.dataset.id ? 'PUT' : 'POST';
  const url = e.target.dataset.id ? `/api/softwares/${e.target.dataset.id}` : '/api/softwares';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ title, description, category, downloadLink })
    });
    loadSoftwares();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
  loadUsers(1);
  loadCategories(1);
  loadSoftwares(1);
  showSection('users');
}