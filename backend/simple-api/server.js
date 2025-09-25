const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Données de démonstration
const projects = [
    {
        id: 1,
        name: "Développement Mobile",
        description: "Application mobile de gestion des tâches",
        color: "#3B82F6",
        taskCount: 12,
        completedTaskCount: 8,
        progress: 67,
        createdAt: "2024-09-20"
    },
    {
        id: 2,
        name: "Site E-commerce",
        description: "Plateforme de vente en ligne",
        color: "#10B981",
        taskCount: 25,
        completedTaskCount: 15,
        progress: 60,
        createdAt: "2024-09-18"
    },
    {
        id: 3,
        name: "API REST",
        description: "Développement d'API pour l'entreprise",
        color: "#F59E0B",
        taskCount: 18,
        completedTaskCount: 12,
        progress: 67,
        createdAt: "2024-09-15"
    }
];

const tasks = [
    {
        id: 1,
        title: "Conception de l'interface",
        description: "Créer les maquettes UX/UI",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: 1,
        assignee: "Jean Dupont",
        dueDate: "2024-09-30"
    },
    {
        id: 2,
        title: "Développement backend",
        description: "Implémenter l'API REST",
        status: "TODO",
        priority: "MEDIUM",
        projectId: 1,
        assignee: "Marie Martin",
        dueDate: "2024-10-05"
    },
    {
        id: 3,
        title: "Tests unitaires",
        description: "Écrire les tests pour l'API",
        status: "COMPLETED",
        priority: "LOW",
        projectId: 2,
        assignee: "Pierre Durand",
        dueDate: "2024-09-25"
    }
];

const users = [
    {
        id: 1,
        firstName: "Fitiavana",
        lastName: "RAMAHATRATRA",
        email: "fitiavanaramahatratra@gmail.com",
        role: "Developer",
        avatarUrl: "/default-avatar.png"
    }
];

// Routes API

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TaskFlow API is running',
        timestamp: new Date().toISOString()
    });
});

// Projets
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
    }
    res.json(project);
});

app.post('/api/projects', (req, res) => {
    const newProject = {
        id: projects.length + 1,
        ...req.body,
        taskCount: 0,
        completedTaskCount: 0,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };
    projects.push(newProject);
    res.status(201).json(newProject);
});

// Tâches
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.get('/api/tasks/urgent', (req, res) => {
    const urgentTasks = tasks.filter(task => 
        task.priority === 'HIGH' || 
        (task.dueDate && new Date(task.dueDate) < new Date())
    );
    res.json(urgentTasks);
});

app.post('/api/tasks', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Utilisateurs
app.get('/api/users/me', (req, res) => {
    res.json(users[0]);
});

// Statistiques
app.get('/api/stats', (req, res) => {
    res.json({
        activeProjects: projects.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        overdueTasks: tasks.filter(t => 
            t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
        ).length
    });
});

// Activité récente
app.get('/api/activity', (req, res) => {
    res.json([
        {
            id: 1,
            description: "Nouveau projet créé: Développement Mobile",
            icon: "fas fa-plus-circle",
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
            id: 2,
            description: "Tâche terminée: Tests unitaires",
            icon: "fas fa-check-circle",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        },
        {
            id: 3,
            description: "Utilisateur ajouté à l'équipe",
            icon: "fas fa-user-plus",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        }
    ]);
});

// Documentation API
app.get('/api', (req, res) => {
    res.json({
        message: "TaskFlow Pro API",
        version: "1.0.0",
        endpoints: {
            projects: "/api/projects",
            tasks: "/api/tasks",
            users: "/api/users",
            stats: "/api/stats",
            activity: "/api/activity",
            health: "/health"
        }
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 TaskFlow API démarrée sur le port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:3000`);
    console.log(`🔗 API: http://localhost:${PORT}`);
    console.log(`📚 Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;
