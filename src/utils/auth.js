// Función para registrar un usuario en localStorage
export function register(username, email, password, question, answer) {
    if (!username || !email || !password || !question || !answer) {
        return { success: false, message: "Todos los campos son obligatorios" };
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Verificar si el usuario ya existe
    if (users.some(user => user.username === username.trim())) {
        return { success: false, message: "El usuario ya está registrado" };
    }

    let newUser = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        securityQuestion: question,
        securityAnswer: answer.trim().toLowerCase(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Registro exitoso. ¡Ahora inicia sesión!" };
}

// Función para iniciar sesión (con usuario de prueba en desarrollo)
export function login(username, password) {
    // Usuario de prueba solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        if (username.trim() === 'admin' && password === 'password123') {
            localStorage.setItem("user", "admin");
            localStorage.setItem("loggedIn", "true");
            return { success: true, message: "Inicio de sesión exitoso" };
        }
    }

    // Lógica original para otros usuarios
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username.trim() && user.password === password);
    
    if (user) {
        localStorage.setItem("user", username);
        localStorage.setItem("loggedIn", "true");
        return { success: true, message: "Inicio de sesión exitoso" };
    } else {
        return { success: false, message: "Usuario o contraseña incorrectos" };
    }
}

// Función para cerrar sesión
export function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
    return localStorage.getItem("loggedIn") === "true";
}

// Función para obtener la pregunta de seguridad
export function getSecurityQuestion(username) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username.trim());

    if (!user) return null;

    const questionMap = {
        "1": "¿Cuál es el nombre de tu mascota?",
        "2": "¿Cuál es tu ciudad de nacimiento?",
        "3": "¿Cuál es tu comida favorita?",
        "4": "¿Cuál es el nombre de tu mejor amigo de la infancia?"
    };

    return questionMap[user.securityQuestion] || "Pregunta no encontrada";
}

// Función para validar la respuesta de seguridad
export function validateSecurityAnswer(username, answer) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.username === username.trim());

    if (user && user.securityAnswer === answer.trim().toLowerCase()) {
        localStorage.setItem("resetUser", username); // Guardar usuario validado
        return true;
    }

    return false;
}

// Función para actualizar la contraseña
export function updatePassword(username, newPassword) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userIndex = users.findIndex(user => user.username === username.trim());

    if (userIndex === -1) {
        return { success: false, message: "Usuario no encontrado" };
    }

    users[userIndex].password = newPassword.trim();
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, message: "Contraseña actualizada correctamente" };
}
