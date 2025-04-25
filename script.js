const usersContainer = document.getElementById('users-container');
const searchInput = document.getElementById('search-username');
const searchBtn = document.getElementById('search-btn');

const usernames = [
    'torvalds',
    'gaearon',
    'yyx990803',
    'sindresorhus',
    'tj',
    'getify'
];

async function fetchUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            console.error(`Failed to fetch user: ${username}`);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching user: ${username}`, error);
        return null;
    }
}

function createUserCard(user) {
    if (!user) return '';
    return `
    <div class="user-card">
        <img src="${user.avatar_url}" alt="${user.login} avatar" />
        <h2>${user.name || 'No name provided'}</h2>
        <p class="login">@${user.login}</p>
        <p class="bio">${user.bio || ''}</p>
        <p><strong>Followers:</strong> ${user.followers}</p>
        <p><strong>Following:</strong> ${user.following}</p>
        <p><strong>Public Repos:</strong> ${user.public_repos}</p>
        <p><a href="${user.html_url}" target="_blank" rel="noopener">View Profile on GitHub</a></p>
    </div>
    `;
}

async function displayUsers() {
    usersContainer.innerHTML = 'Loading...';
    const usersData = await Promise.all(usernames.map(fetchUser));
    usersContainer.innerHTML = usersData.map(createUserCard).join('');
}

async function searchUser() {
    const username = searchInput.value.trim();
    if (!username) return;
    usersContainer.innerHTML = 'Loading...';
    const user = await fetchUser(username);
    if (user) {
        usersContainer.innerHTML = createUserCard(user);
    } else {
        usersContainer.innerHTML = '<p>User not found.</p>';
    }
}

searchBtn.addEventListener('click', searchUser);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchUser();
    }
});

displayUsers();
