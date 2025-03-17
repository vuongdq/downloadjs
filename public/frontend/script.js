const token = localStorage.getItem('token');

// Kiểm tra token, nếu không có thì chuyển hướng đến trang đăng nhập
if (!token && window.location.pathname !== '/admin/login.html') {
  window.location.href = '/admin/login.html';
}

// Xử lý form đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/admin';
    } else {
      document.getElementById('loginMessage').textContent = data.message || 'Đăng nhập thất bại';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('loginMessage').textContent = 'Có lỗi xảy ra, vui lòng thử lại';
  }
});

// Đăng xuất
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/admin/login.html';
}

// Hiển thị section tương ứng
function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
  document.getElementById(sectionId).style.display = 'block';
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
  document.querySelector(`.sidebar-nav a[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Load danh sách user
async function loadUsers() {
  try {
    const res = await fetch('/api/auth/users', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const users = await res.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
      userList.innerHTML += `
        <tr>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>
            <button class="edit" onclick="editUser('${user._id}')">Sửa</button>
            <button class="delete" onclick="deleteUser('${user._id}')">Xóa</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    document.getElementById('userList').innerHTML = '<tr><td colspan="3">Lỗi khi tải danh sách user</td></tr>';
  }
}

// Xử lý form user (thêm/sửa)
document.getElementById('userForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('userUsername').value;
  const email = document.getElementById('userEmail').value;
  const password = document.getElementById('userPassword').value;
  const method = e.target.dataset.id ? 'PUT' : 'POST';
  const url = e.target.dataset.id ? `/api/auth/users/${e.target.dataset.id}` : '/api/auth/register';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ username, email, password }),
    });
    loadUsers();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

// Sửa user
async function editUser(id) {
  try {
    const res = await fetch('/api/auth/users', { headers: { 'Authorization': `Bearer ${token}` } });
    const users = await res.json();
    const user = users.find(u => u._id === id);
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = '';
    document.getElementById('userForm').dataset.id = id;
  } catch (err) {
    console.error(err);
  }
}

// Xóa user
async function deleteUser(id) {
  if (confirm('Bạn có chắc muốn xóa user này?')) {
    try {
      await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }
}

// Load danh sách danh mục
async function loadCategories() {
  try {
    const res = await fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const categories = await res.json();
    const categoryList = document.getElementById('categoryList');
    const categorySelect = document.getElementById('softwareCategory');
    categoryList.innerHTML = '';
    categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
    categories.forEach(cat => {
      categoryList.innerHTML += `
        <tr>
          <td>${cat.name}</td>
          <td>${cat.description || 'Không có mô tả'}</td>
          <td>
            <button class="edit" onclick="editCategory('${cat._id}')">Sửa</button>
            <button class="delete" onclick="deleteCategory('${cat._id}')">Xóa</button>
          </td>
        </tr>
      `;
      categorySelect.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
    });
  } catch (err) {
    console.error(err);
    document.getElementById('categoryList').innerHTML = '<tr><td colspan="3">Lỗi khi tải danh mục</td></tr>';
  }
}

// Xử lý form danh mục (thêm/sửa)
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
      body: JSON.stringify({ name, description }),
    });
    loadCategories();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

// Sửa danh mục
async function editCategory(id) {
  try {
    const res = await fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } });
    const categories = await res.json();
    const category = categories.find(c => c._id === id);
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryDesc').value = category.description || '';
    document.getElementById('categoryForm').dataset.id = id;
  } catch (err) {
    console.error(err);
  }
}

// Xóa danh mục
async function deleteCategory(id) {
  if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      loadCategories();
    } catch (err) {
      console.error(err);
    }
  }
}

// Load danh sách phần mềm
async function loadSoftwares() {
  try {
    const res = await fetch('/api/softwares?page=1&limit=10', { headers: { 'Authorization': `Bearer ${token}` } });
    if (!res.ok) throw new Error('Failed to fetch softwares');
    const data = await res.json();
    const softwareList = document.getElementById('softwareList');
    softwareList.innerHTML = '';
    data.softwares.forEach(soft => {
      softwareList.innerHTML += `
        <tr>
          <td>${soft.title}</td>
          <td>${soft.category?.name || 'Không có danh mục'}</td>
          <td><a href="${soft.downloadLink}" target="_blank">${soft.downloadLink.slice(0, 30)}${soft.downloadLink.length > 30 ? '...' : ''}</a></td>
          <td>
            <button class="edit" onclick="editSoftware('${soft._id}')">Sửa</button>
            <button class="delete" onclick="deleteSoftware('${soft._id}')">Xóa</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
    document.getElementById('softwareList').innerHTML = '<tr><td colspan="4">Lỗi khi tải phần mềm</td></tr>';
  }
}

// Xử lý form phần mềm (thêm/sửa)
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
      body: JSON.stringify({ title, description, category, downloadLink }),
    });
    loadSoftwares();
    e.target.reset();
    delete e.target.dataset.id;
  } catch (err) {
    console.error(err);
  }
});

// Sửa phần mềm
async function editSoftware(id) {
  try {
    const res = await fetch(`/api/softwares/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
    const soft = await res.json();
    document.getElementById('softwareTitle').value = soft.title;
    document.getElementById('softwareDesc').value = soft.description || '';
    document.getElementById('softwareCategory').value = soft.category?._id || '';
    document.getElementById('softwareLink').value = soft.downloadLink;
    document.getElementById('softwareForm').dataset.id = id;
  } catch (err) {
    console.error(err);
  }
}

// Xóa phần mềm
async function deleteSoftware(id) {
  if (confirm('Bạn có chắc muốn xóa phần mềm này?')) {
    try {
      await fetch(`/api/softwares/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      loadSoftwares();
    } catch (err) {
      console.error(err);
    }
  }
}

// Load dữ liệu khi vào trang admin
if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
  loadUsers();
  loadCategories();
  loadSoftwares();
  showSection('users');
}