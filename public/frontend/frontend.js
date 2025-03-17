const token = localStorage.getItem('token');
let isLoggedIn = !!token;
let userInfo = null;

async function updateAuthStatus() {
  const userStatus = document.getElementById('userStatus');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const profileBtn = document.getElementById('profileBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (isLoggedIn && token) {
    try {
      const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        userInfo = await res.json();
        userStatus.textContent = `Hello, ${userInfo.username}`;
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        profileBtn.style.display = 'inline';
        logoutBtn.style.display = 'inline';
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    userStatus.textContent = 'Not logged in';
    loginBtn.style.display = 'inline';
    registerBtn.style.display = 'inline';
    profileBtn.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
}

const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const profileBtn = document.getElementById('profileBtn');
const logoutBtn = document.getElementById('logoutBtn');
const closeButtons = document.getElementsByClassName('close');

loginBtn?.addEventListener('click', () => loginModal.style.display = 'block');
registerBtn?.addEventListener('click', () => registerModal.style.display = 'block');
profileBtn?.addEventListener('click', () => window.location.href = '/frontend/profile.html');
logoutBtn?.addEventListener('click', () => {
  localStorage.removeItem('token');
  isLoggedIn = false;
  userInfo = null;
  updateAuthStatus();
  if (window.location.pathname === '/frontend/profile.html') window.location.href = '/';
});

for (let btn of closeButtons) {
  btn.addEventListener('click', () => {
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
  });
}

window.onclick = (event) => {
  if (event.target == loginModal) loginModal.style.display = 'none';
  if (event.target == registerModal) registerModal.style.display = 'none';
};

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      isLoggedIn = true;
      loginModal.style.display = 'none';
      updateAuthStatus();
      if (window.location.pathname === '/frontend/software.html') loadSoftwareDetail();
    } else {
      document.getElementById('loginMessage').textContent = data.message || 'Login failed';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('loginMessage').textContent = 'Server error';
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      isLoggedIn = true;
      registerModal.style.display = 'none';
      updateAuthStatus();
    } else {
      document.getElementById('registerMessage').textContent = data.message || 'Registration failed';
    }
  } catch (err) {
    console.error(err);
    document.getElementById('registerMessage').textContent = 'Server error';
  }
});

async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const categories = await res.json();
    const categoryList = document.getElementById('categoryList');
    const categoryFilter = document.getElementById('categoryFilter');
    categoryList.innerHTML = '';
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    for (let cat of categories.categories) {
      const softwareRes = await fetch(`/api/softwares?category=${cat._id}&limit=5`);
      const softwareData = await softwareRes.json();
      const softwarePreview = softwareData.softwares.map(soft => `<li><a href="/frontend/software.html?id=${soft._id}">${soft.title}</a></li>`).join('');

      categoryList.innerHTML += `
        <div class="category-item">
          <h3><a href="/frontend/category.html?id=${cat._id}">${cat.name}</a></h3>
          <p>${cat.description || 'No description'}</p>
          <div class="software-preview">
            <h4>Top Software:</h4>
            <ul>${softwarePreview || 'No software available'}</ul>
          </div>
        </div>
      `;
      categoryFilter.innerHTML += `<option value="${cat._id}">${cat.name}</option>`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById('categoryList').innerHTML = '<p>Error loading categories</p>';
  }
}

async function loadCategoryDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const page = urlParams.get('page') || 1;
  if (!id) return;

  try {
    const catRes = await fetch(`/api/categories/${id}`);
    const cat = await catRes.json();
    document.getElementById('categoryTitle').textContent = cat.name;
    document.getElementById('categoryDesc').textContent = cat.description || 'No description';

    const softRes = await fetch(`/api/softwares?category=${id}&page=${page}&limit=10`);
    const data = await softRes.json();
    const softwareList = document.getElementById('softwareList');
    softwareList.innerHTML = '';
    data.softwares.forEach(soft => {
      softwareList.innerHTML += `
        <div class="software-item">
          <h3><a href="/frontend/software.html?id=${soft._id}">${soft.title}</a></h3>
          <p>${soft.description ? soft.description.slice(0, 100) + '...' : 'No description'}</p>
          <a href="/frontend/software.html?id=${soft._id}" class="btn btn-primary">Download</a>
        </div>
      `;
    });
    updatePagination(data.totalPages, parseInt(page), `/frontend/category.html?id=${id}&page=`);
  } catch (err) {
    console.error(err);
    document.getElementById('softwareList').innerHTML = '<p>Error loading software</p>';
  }
}

async function loadSoftwareDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  try {
    const res = await fetch(`/api/softwares/${id}`);
    if (!res.ok) throw new Error('Failed to fetch software');
    const soft = await res.json();
    document.getElementById('softwareTitle').textContent = soft.title;
    document.getElementById('softwareDesc').innerHTML = soft.description || 'No description';
    document.getElementById('softwareCategory').textContent = soft.category?.name || 'No category';
    startDownloadCountdown(soft.downloadLink);
  } catch (err) {
    console.error(err);
    document.getElementById('softwareTitle').textContent = 'Error loading software';
  }
}

function startDownloadCountdown(link) {
  const btn = document.getElementById('downloadBtn');
  const countdown = document.getElementById('countdown');
  const downloadLink = document.getElementById('downloadLink');

  if (isLoggedIn) {
    btn.style.display = 'none';
    downloadLink.href = link;
    downloadLink.style.display = 'inline';
    downloadLink.textContent = 'Click to Download';
  } else {
    let timeLeft = 5;
    const timer = setInterval(() => {
      timeLeft--;
      countdown.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        btn.style.display = 'none';
        downloadLink.href = link;
        downloadLink.style.display = 'inline';
        downloadLink.textContent = 'Click to Download';
      }
    }, 1000);
  }
}

async function loadProfile() {
  if (!isLoggedIn || !token) {
    window.location.href = '/';
    return;
  }
  try {
    const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) {
      userInfo = await res.json();
      document.getElementById('profileUsername').textContent = userInfo.username;
      document.getElementById('profileEmail').textContent = userInfo.email;
      document.getElementById('profileRole').textContent = userInfo.role === 'admin' ? 'Admin' : 'User';
    } else {
      throw new Error('Failed to fetch user info');
    }
  } catch (err) {
    console.error(err);
    window.location.href = '/';
  }
}

function updatePagination(totalPages, currentPage, baseUrl) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';
  if (totalPages > 1) {
    pagination.innerHTML += `<button onclick="window.location.href='${baseUrl}${currentPage - 1}'" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button onclick="window.location.href='${baseUrl}${i}'" ${i === currentPage ? 'disabled' : ''}>${i}</button>`;
    }
    pagination.innerHTML += `<button onclick="window.location.href='${baseUrl}${currentPage + 1}'" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;
  }
}

document.getElementById('searchInput')?.addEventListener('input', () => loadCategories());
document.getElementById('categoryFilter')?.addEventListener('change', () => loadCategories());

if (window.location.pathname === '/' || window.location.pathname === '/frontend/index.html') {
  updateAuthStatus();
  loadCategories();
} else if (window.location.pathname === '/frontend/category.html') {
  updateAuthStatus();
  loadCategoryDetail();
} else if (window.location.pathname === '/frontend/software.html') {
  updateAuthStatus();
  loadSoftwareDetail();
} else if (window.location.pathname === '/frontend/profile.html') {
  updateAuthStatus();
  loadProfile();
}