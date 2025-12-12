#  Portafolio Administrativo – Proyecto Interciclo

Plataforma web desarrollada para la gestión de proyectos y usuarios según roles, implementada con **Angular** y **Firebase**, enfocada en buenas prácticas de desarrollo, validación de datos y control de acceso.

---

##  Institución

**Universidad Politécnica Salesiana**  
Carrera: Ingeniería en Ciencias de la Computación  
Asignatura: Programación y Plataformas Web  
Periodo: Interciclo  

---

##  Integrantes

- **Jean Pierre Valarezo Villalta**  
  GitHub: https://github.com/jean-pierre-valarezo

   - **Sebastian Gomez**  
  GitHub: https://github.com/SebastianGomez0910

🔗 **Repositorio del proyecto:**  
https://github.com/JeanPierreValarezo/icc-ppw-u2-Portafolio

---

##  Tecnologías Utilizadas

### Frontend
- Angular
- TypeScript
- Tailwind CSS
- DaisyUI

### Backend / Servicios
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

---

##  Descripción del Proyecto

El **Portafolio Administrativo** es una aplicación web que permite gestionar proyectos académicos y profesionales mediante un sistema de roles.  
El sistema controla el acceso a las funcionalidades según el tipo de usuario, asegurando una correcta organización de la información y una experiencia de uso clara y segura.

Permite a los administradores gestionar usuarios y roles, a los programadores administrar sus proyectos y a los usuarios generales visualizar información de forma controlada.

---

## 👤 Roles y Funcionalidades

###  Administrador
- Inicio de sesión seguro.
- Acceso al panel administrativo.
- Gestión de usuarios y roles.
- Visualización global de proyectos.
- Control de permisos del sistema.

###  Programador
- Acceso a su panel de trabajo.
- Creación de proyectos académicos o profesionales.
- Edición y eliminación de sus proyectos.
- Validación de datos antes del guardado.
- Persistencia de datos en Firebase Firestore.

###  Usuario General
- Inicio de sesión.
- Visualización de proyectos disponibles.
- Acceso limitado según permisos asignados.

---

##  Módulos y Pantallas del Sistema

- Página principal
- Login
- Panel Administrador
- Gestión de usuarios
- Gestión de roles
- Panel del programador
- Gestión de proyectos
- Visualización de proyectos
- Perfil de usuario

---

##  Flujos Principales del Sistema

### Flujo de Autenticación
1. El usuario ingresa sus credenciales.
2. Firebase valida la autenticación.
3. El sistema identifica el rol del usuario.
4. Se redirige al panel correspondiente.

### Flujo de Creación de Proyectos
1. El programador completa el formulario.
2. El sistema valida los campos obligatorios.
3. Se validan enlaces con `http://` o `https://`.
4. Los datos se almacenan en Firebase Firestore.
5. El proyecto se refleja automáticamente en la interfaz.

---

##  Fragmentos Técnicos Importantes

### Guardado de proyectos en Firebase
```ts
await this.projectService.addProject(this.newProject);


