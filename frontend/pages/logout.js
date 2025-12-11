import service from "../services/api.js"



document.getElementById('logoutBtn')?.addEventListener('click', async (e) => {
      e.preventDefault()
      try {
        await service.logout()
        window.location.href = '/frontend/vistas/login/login.html'
      } catch (error) {
        alert(error)
      }
      
    })
