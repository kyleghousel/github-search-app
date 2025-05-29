document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#github-form')
  const searchInput = document.querySelector('#search')
  const filterSelect = document.querySelector('#search-filter')
  const userList = document.querySelector('#user-list')
  const repoList = document.querySelector('#repos-list')

  const appendUsers = (users) => {
    userList.innerHTML = ''

    const userCollection = users.items
    userCollection.forEach(user => {
      const userLi = document.createElement('li')
      userLi.innerHTML = `
      <div>
        <h2>${user.login}</h2>
        <a href=${user.html_url}>Github Profile</a>
      </div>
        <img src=${user.avatar_url} alt='user-avatar' style='width: 200px; height: 200px; border-radius: 50%'/>
      `

      userLi.addEventListener('click', e => fetchUserRepos(user.login))

      userList.appendChild(userLi)
    })
  }

  const appendRepos = (repos) => {
    repoList.innerHTML = ''

    const repoHeader = document.createElement('h2')
    repoHeader.textContent = `Repos`
    repoList.appendChild(repoHeader)

    if (Array.isArray(repos)) {
      repos.forEach(repo => {
        repoList.innerHTML += `
        <li><a href=${repo.html_url}>${repo.name}</a></li>
        `
      })
    } else {
      userList.innerHTML = ''
      repos.items.forEach(repo => {
        repoList.innerHTML += `
        <li><a href=${repo.html_url}>${repo.name}</a></li>
        `
      })
    }
  }

  const searchUser = (user) => {

    fetch(`https://api.github.com/search/users?q=${user}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(response => response.json())
      .then(appendUsers)
      .catch(error => console.log('Error: ', error.message))
  }

  const fetchUserRepos = (targetUser) => {
    fetch(`https://api.github.com/users/${targetUser}/repos?per_page=50`)
      .then(res => res.json())
      .then(appendRepos)
      .catch(error => console.log('Error: ', error.message))
  }

  const searchRepos = (keyword) => {
    fetch(`https://api.github.com/search/repositories?q=${keyword}+language:javascript&sort=stars&order=desc`)
      .then(res => res.json())
      .then(appendRepos)
      .catch(error => console.log('Error: ', error.message))
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (filterSelect.value === 'users') {
      searchUser(searchInput.value)
    } else if (filterSelect.value === 'repos') {
      searchRepos(searchInput.value)
    }

    searchInput.value = ''
  })
})
