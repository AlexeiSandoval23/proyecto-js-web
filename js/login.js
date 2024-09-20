document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('usuarios.json')
            .then(response => response.json())
            .then(usuarios => {
                const user = usuarios.find(u => u.username === username && u.password === password);
                
                if (user) {
                    Swal.fire({
                        title: '¡Inicio de sesión exitoso!',
                        text: 'Bienvenido a la Confitería del Cine',
                        icon: 'success',
                        confirmButtonText: 'Continuar',
                        customClass: {
                            confirmButton: 'custom-confirm-button'
                        }
                    }).then(() => {
                        window.location.href = '../../index.html'; //  Redirigir a la página principal

                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Nombre de usuario o contraseña incorrectos.',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo',
                        customClass: {
                            confirmButton: 'custom-confirm-button'
                        }
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al intentar iniciar sesión. Inténtalo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'custom-confirm-button'
                    }
                });
                console.error('Error al cargar los usuarios:', error);
            });
    });
});
