export const LocalStorageService = {
    initDB() {
        if (!localStorage.getItem('taskManagerDB')) {
            const initialDB = {
                users: [],
                sessions: []
            };
            localStorage.setItem('taskManagerDB', JSON.stringify(initialDB));
        }
    },

    registerUser(user) {
        const db = this.getDB();
        if (db) {
            // Проверка на существующего пользователя
            if (db.users.some(u => u.email === user.email)) {
                throw new Error('Пользователь с таким email уже существует');
            }

            const newUser = {
                id: Date.now().toString(),
                name: user.name,
                email: user.email,
                password: user.password,
                createdAt: new Date().toISOString()
            };

            db.users.push(newUser);
            localStorage.setItem('taskManagerDB', JSON.stringify(db));

            return newUser;
        }
    },

    loginUser(email, password) {
        const db = this.getDB();
        if (db) {
            const user = db.users.find(u => u.email === email && u.password === password);
            if (!user) {
                throw new Error('Неверный email или пароль');
            }

            // Создаем сессию
            const session = {
                token: this.generateToken(user.id),
                userId: user.id,
                createdAt: new Date().toISOString()
            };

            db.sessions.push(session);
            localStorage.setItem('taskManagerDB', JSON.stringify(db));

            return { user, token: session.token };
        }
    },

    // Получение текущего пользователя по токену
    getCurrentUser(token) {
        const db = this.getDB();
        if (db) {
            const session = db.sessions.find(s => s.token === token);
            if (session) {
                return db.users.find(u => u.id === session.userId);
            }
        }
        return null;
    },

    getDB() {
        const db = localStorage.getItem('taskManagerDB');
        return db ? JSON.parse(db) : null;
    },

    generateToken(userId) {
        return `tm-${btoa(userId)}-${Date.now()}`;
    },

    updateUser(userId, updates) {
        const db = this.getDB();
        if (db) {
            const userIndex = db.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                // Проверяем, не занят ли новый email другим пользователем
                if (updates.email && updates.email !== db.users[userIndex].email) {
                    const emailExists = db.users.some(u => u.email === updates.email && u.id !== userId);
                    if (emailExists) {
                        throw new Error('Email уже занят');
                    }
                }

                db.users[userIndex] = {
                    ...db.users[userIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('taskManagerDB', JSON.stringify(db));
                return db.users[userIndex];
            }
        }
        throw new Error('User not found');
    },

    getTasks(includeArchived = false) {
        const db = this.getDB();
        if (!db?.tasks) return [];
        return includeArchived
            ? db.tasks
            : db.tasks.filter(task => !task.archived);
    },

    createTask(task) {
        const db = this.getDB();
        if (db) {
            if (!db.tasks) db.tasks = [];
            const newTask = {
                id: Date.now().toString(),
                ...task,
                createdAt: new Date().toISOString(),
                archived: false,
                status: task.status || 'new'
            };
            db.tasks.push(newTask);
            localStorage.setItem('taskManagerDB', JSON.stringify(db));
            return newTask;
        }
    },

    updateTask(taskId, updates) {
        const db = this.getDB();
        if (db?.tasks) {
            const taskIndex = db.tasks.findIndex(t => t.id === taskId);
            if (taskIndex !== -1) {
                db.tasks[taskIndex] = {
                    ...db.tasks[taskIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                localStorage.setItem('taskManagerDB', JSON.stringify(db));
                return db.tasks[taskIndex];
            }
        }
        throw new Error('Task not found');
    },

    deleteTask(taskId) {
        const db = this.getDB();
        if (db?.tasks) {
            console.log('Before deletion:', db.tasks.length); // Логируем перед удалением
            db.tasks = db.tasks.filter(t => t.id !== taskId);
            console.log('After deletion:', db.tasks.length); // Логируем после удаления
            localStorage.setItem('taskManagerDB', JSON.stringify(db));
            return true; // Явно возвращаем успешное выполнение
        }
        throw new Error('Task not found');
    }
};
LocalStorageService.initDB();