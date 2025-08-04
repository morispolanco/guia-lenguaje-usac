// App Configuration
const CONFIG = {
    stripe: {
        publishableKey: 'pk_live_51JOLcwFlSFoL2Zh4SekRb1wkEsJTmKFycTZo7uxBmJ2FhclabFO7gbZp1q3WMsk7mNXqrPIti4dIoSXfNyosxSbO00k1QZ3GaN',
        priceId: 'price_1RsCvfFlSFoL2Zh44D5nxCpx'
    },
    gemini: {
        apiKey: 'AIzaSyAzM-0NsO1tLMu6RHpQJSPBXUbJ0PjRj8E',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
    },
    supabase: {
        url: 'https://augrzzbvroycxdosamom.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Z3J6emJ2cm95Y3hkb3NhbW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODgxNTEsImV4cCI6MjA2OTg2NDE1MX0.QvZkp8c-zAioBX1VjBOzHVLh4BZtXNTgbiz6UfuNbKY'
    }
};

// Global State
let currentUser = null;
let currentModule = null;
let currentLesson = 0;
let userProgress = {};
let quizData = {};
let stripe = null;
let supabase = null;

// AI Context para seguimiento de discusiones
let aiConversationHistory = [];

// Module Data Structure
const MODULES = {
    comunicacion: {
        title: 'Comunicación',
        icon: 'fas fa-comments',
        lessons: [
            { title: 'La Comunicación', content: 'comunicacion-1' },
            { title: 'Juicio, Razonamiento y Argumentación', content: 'comunicacion-2' },
            { title: 'La Argumentación', content: 'comunicacion-3' },
            { title: 'Vicios de Dicción', content: 'comunicacion-4' },
            { title: 'El Discurso', content: 'comunicacion-5' }
        ]
    },
    lenguaje: {
        title: 'Lenguaje',
        icon: 'fas fa-language',
        lessons: [
            { title: 'Lenguaje, Lengua, Dialecto y Habla', content: 'lenguaje-1' },
            { title: 'El Signo Lingüístico', content: 'lenguaje-2' },
            { title: 'Tipos de Lenguaje', content: 'lenguaje-3' },
            { title: 'Códigos Gestuales e Iconográficos', content: 'lenguaje-4' },
            { title: 'Denotación y Connotación', content: 'lenguaje-5' },
            { title: 'Niveles de la Lengua', content: 'lenguaje-6' },
            { title: 'Disciplinas que Estudian la Lengua', content: 'lenguaje-7' }
        ]
    },
    ortografia: {
        title: 'Ortografía',
        icon: 'fas fa-spell-check',
        lessons: [
            { title: 'Ortografía Literal', content: 'ortografia-1' },
            { title: 'Signos Utilizados en la Escritura', content: 'ortografia-2' },
            { title: 'Acentuación', content: 'ortografia-3' },
            { title: 'Escritura de Mayúsculas y Minúsculas', content: 'ortografia-4' },
            { title: 'Abreviaturas, Siglas y Acrónimos', content: 'ortografia-5' },
            { title: 'Los Números', content: 'ortografia-6' }
        ]
    },
    gramatica: {
        title: 'Gramática y Vocabulario',
        icon: 'fas fa-book',
        lessons: [
            { title: 'La Oración', content: 'gramatica-1' },
            { title: 'Clases o Categorías Gramaticales', content: 'gramatica-2' },
            { title: 'Modificadores en la Oración', content: 'gramatica-3' },
            { title: 'Conjugaciones o Flexiones Verbales', content: 'gramatica-4' },
            { title: 'Niveles de Análisis Gramatical', content: 'gramatica-5' },
            { title: 'Uso de Preposiciones y Conjunciones', content: 'gramatica-6' },
            { title: 'Concordancia', content: 'gramatica-7' },
            { title: 'Gramática de Usos', content: 'gramatica-8' },
            { title: 'Muletillas en el Discurso', content: 'gramatica-9' },
            { title: 'Palabras de Uso Confuso', content: 'gramatica-10' },
            { title: 'Formación de Palabras', content: 'gramatica-11' },
            { title: 'Vocabulario', content: 'gramatica-12' }
        ]
    },
    exposicion: {
        title: 'Exposición Oral y Escrita',
        icon: 'fas fa-pen',
        lessons: [
            { title: 'Redacción de Textos', content: 'exposicion-1' },
            { title: 'El Párrafo', content: 'exposicion-2' },
            { title: 'Textos Descriptivos', content: 'exposicion-3' },
            { title: 'Textos Narrativos', content: 'exposicion-4' },
            { title: 'Textos Expositivos', content: 'exposicion-5' },
            { title: 'Textos Argumentativos', content: 'exposicion-6' },
            { title: 'El Informe o Exposición', content: 'exposicion-7' },
            { title: 'El Resumen', content: 'exposicion-8' },
            { title: 'La Síntesis', content: 'exposicion-9' },
            { title: 'El Ensayo', content: 'exposicion-10' },
            { title: 'La Reseña', content: 'exposicion-11' },
            { title: 'Organizadores Gráficos', content: 'exposicion-12' },
            { title: 'Técnicas de Intercambio de Información', content: 'exposicion-13' }
        ]
    },
    comprension: {
        title: 'Comprensión Lectora',
        icon: 'fas fa-book-open',
        lessons: [
            { title: 'Detalles Importantes', content: 'comprension-1' },
            { title: 'Idea Principal e Ideas Secundarias', content: 'comprension-2' },
            { title: 'Secuencia de Eventos', content: 'comprension-3' },
            { title: 'El Contexto', content: 'comprension-4' },
            { title: 'Condiciones, Relaciones de Causa y Efecto', content: 'comprension-5' },
            { title: 'Comparaciones y Contrastes', content: 'comprension-6' },
            { title: 'Apoyos Gráficos', content: 'comprension-7' },
            { title: 'Deducción e Inducción', content: 'comprension-8' },
            { title: 'Estrategias de Comprensión Lectora', content: 'comprension-9' },
            { title: 'Figuras Literarias', content: 'comprension-10' },
            { title: 'Géneros Literarios', content: 'comprension-11' },
            { title: 'Subgéneros Literarios', content: 'comprension-12' },
            { title: 'Literatura Guatemalteca e Hispanoamericana', content: 'comprension-13' }
        ]
    }
};

// Lesson Content Templates
const LESSON_CONTENT = {
    'comunicacion-1': {
        title: 'La Comunicación',
        content: `
            <h3>Conceptos Fundamentales del Proceso Comunicativo</h3>
            <p>La comunicación es el proceso mediante el cual se transmite información, ideas, sentimientos y conocimientos entre dos o más personas. Es fundamental para el desarrollo de las relaciones humanas y la organización social.</p>
            
            <h4>Elementos de la Comunicación</h4>
            <ul>
                <li><strong>Emisor:</strong> Quien envía el mensaje</li>
                <li><strong>Receptor:</strong> Quien recibe el mensaje</li>
                <li><strong>Mensaje:</strong> La información transmitida</li>
                <li><strong>Código:</strong> Sistema de signos y reglas</li>
                <li><strong>Canal:</strong> Medio por el que se transmite</li>
                <li><strong>Contexto:</strong> Situación en que ocurre</li>
                <li><strong>Ruido:</strong> Interferencias en el proceso</li>
            </ul>
            
            <h4>Funciones del Lenguaje</h4>
            <ul>
                <li><strong>Informativa:</strong> Transmite datos objetivos</li>
                <li><strong>Emotiva:</strong> Expresa sentimientos del emisor</li>
                <li><strong>Apelativa:</strong> Busca influir en el receptor</li>
                <li><strong>Poética:</strong> Se centra en la forma del mensaje</li>
                <li><strong>Fática:</strong> Establece contacto</li>
                <li><strong>Metalingüística:</strong> Habla sobre el código</li>
            </ul>
        `,
        exercises: [
            {
                type: 'multiple-choice',
                question: '¿Cuál es el elemento de la comunicación que se refiere a quien envía el mensaje?',
                options: ['Receptor', 'Emisor', 'Canal', 'Código'],
                correct: 1
            }
        ]
    }
    // More lesson content would be added here
};

// Supabase Authentication Functions
const supabaseAuth = {
    signUp: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            // Create profile for the user
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: data.user.id,
                            email: email,
                            first_name: '',
                            last_name: ''
                        }
                    ]);
                
                if (profileError) console.warn('Profile creation warning:', profileError);
            }
            
            return data;
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    },
    
    signIn: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    },
    
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },
    
    getCurrentUser: () => {
        return supabase.auth.getUser();
    },
    
    onAuthStateChange: (callback) => {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Show loading screen
    const loadingScreen = document.getElementById('loading-screen');
    
    try {
        // Initialize Supabase
        if (window.supabase) {
            supabase = window.supabase.createClient(CONFIG.supabase.url, CONFIG.supabase.anonKey);
            console.log('Supabase initialized successfully');
        } else {
            console.error('Supabase library not loaded');
        }
        
        // Initialize Stripe
        if (window.Stripe) {
            stripe = Stripe(CONFIG.stripe.publishableKey);
        }
        
        // Set up auth state listener
        if (supabase) {
            supabaseAuth.onAuthStateChange((event, session) => {
                if (session?.user) {
                    currentUser = session.user;
                    loadUserProfile();
                } else {
                    currentUser = null;
                }
                updateUI();
            });
            
            // Check for existing session
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                currentUser = session.user;
                await loadUserProfile();
            }
        }
        
        // Load modules data
        await loadModulesData();
        
        // Initialize UI
        setupEventListeners();
        updateUI();
        
        // Hide loading screen
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
        
    } catch (error) {
        console.error('App initialization error:', error);
        loadingScreen.classList.add('hidden');
    }
}

function setupEventListeners() {
    // Authentication Modal Events
    setupAuthModalEvents();
    
    // Payment Modal Events
    setupPaymentModalEvents();
    
    // Navigation Events
    setupNavigationEvents();
    
    // Module Events
    setupModuleEvents();
    
    // Quiz Events
    setupQuizEvents();
}

function setupAuthModalEvents() {
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const closeAuth = document.getElementById('close-auth');
    const authForm = document.getElementById('auth-form');
    const authSwitchLink = document.getElementById('auth-switch-link');
    
    loginBtn.addEventListener('click', () => {
        showAuthModal('login');
    });
    
    registerBtn.addEventListener('click', () => {
        showAuthModal('register');
    });
    
    closeAuth.addEventListener('click', () => {
        hideModal(authModal);
    });
    
    authSwitchLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });
    
    authForm.addEventListener('submit', handleAuthSubmit);
    
    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            hideModal(authModal);
        }
    });
}

function setupPaymentModalEvents() {
    const paymentModal = document.getElementById('payment-modal');
    const getAccessBtn = document.getElementById('get-access-btn');
    const closePayment = document.getElementById('close-payment');
    const submitPayment = document.getElementById('submit-payment');
    
    getAccessBtn.addEventListener('click', () => {
        if (!currentUser) {
            showAuthModal('register');
            return;
        }
        showPaymentModal();
    });
    
    closePayment.addEventListener('click', () => {
        hideModal(paymentModal);
    });
    
    submitPayment.addEventListener('click', handlePaymentSubmit);
    
    // Close modal when clicking outside
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) {
            hideModal(paymentModal);
        }
    });
}

function setupNavigationEvents() {
    const userAvatar = document.getElementById('user-avatar');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutLink = document.getElementById('logout-link');
    const demoBtns = document.querySelectorAll('#demo-btn');
    
    if (userAvatar) {
        userAvatar.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    demoBtns.forEach(btn => {
        btn.addEventListener('click', showDemoContent);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            userDropdown?.classList.remove('show');
        }
    });
}

function setupModuleEvents() {
    const moduleCards = document.querySelectorAll('.module-card');
    const backToModules = document.getElementById('back-to-modules');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const moduleId = card.dataset.module;
            openModule(moduleId);
        });
    });
    
    if (backToModules) {
        backToModules.addEventListener('click', () => {
            showSection('modules');
        });
    }
}

function setupQuizEvents() {
    const quizNext = document.getElementById('quiz-next');
    const quizBack = document.getElementById('quiz-back');
    const continuelearning = document.getElementById('continue-learning');
    const retryQuiz = document.getElementById('retry-quiz');
    
    if (quizNext) {
        quizNext.addEventListener('click', handleQuizNext);
    }
    
    if (quizBack) {
        quizBack.addEventListener('click', handleQuizBack);
    }
    
    if (continuelearning) {
        continuelearning.addEventListener('click', () => {
            showSection('modules');
        });
    }
    
    if (retryQuiz) {
        retryQuiz.addEventListener('click', () => {
            startQuiz(currentModule);
        });
    }
}

// Authentication Functions
function showAuthModal(mode = 'login') {
    const modal = document.getElementById('auth-modal');
    const title = document.getElementById('auth-title');
    const submitBtn = document.getElementById('auth-submit');
    const confirmPasswordGroup = document.getElementById('confirm-password-group');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.getElementById('auth-switch-link');
    
    if (mode === 'login') {
        title.textContent = 'Iniciar Sesión';
        submitBtn.textContent = 'Iniciar Sesión';
        confirmPasswordGroup.style.display = 'none';
        switchText.textContent = '¿No tienes cuenta?';
        switchLink.textContent = 'Registrarse';
    } else {
        title.textContent = 'Registrarse';
        submitBtn.textContent = 'Crear Cuenta';
        confirmPasswordGroup.style.display = 'block';
        switchText.textContent = '¿Ya tienes cuenta?';
        switchLink.textContent = 'Iniciar Sesión';
    }
    
    modal.dataset.mode = mode;
    showModal(modal);
}

function toggleAuthMode() {
    const modal = document.getElementById('auth-modal');
    const currentMode = modal.dataset.mode;
    const newMode = currentMode === 'login' ? 'register' : 'login';
    showAuthModal(newMode);
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    
    const modal = document.getElementById('auth-modal');
    const mode = modal.dataset.mode;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (mode === 'register' && password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    try {
        if (mode === 'login') {
            const { user, error } = await supabaseAuth.signIn(email, password);
            if (error) throw error;
            alert('¡Bienvenido de vuelta!');
        } else {
            const { user, error } = await supabaseAuth.signUp(email, password);
            if (error) throw error;
            alert('¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.');
        }
        
        hideModal(modal);
        document.getElementById('auth-form').reset();
        updateUI();
    } catch (error) {
        console.error('Auth error:', error);
        
        // Show user-friendly error messages
        let message = 'Error de autenticación: ';
        if (error.message.includes('Invalid login credentials')) {
            message = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.message.includes('User already registered')) {
            message = 'Ya existe una cuenta con este email. Intenta iniciar sesión.';
        } else if (error.message.includes('Password should be')) {
            message = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
            message += error.message;
        }
        
        alert(message);
    }
}

async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await supabaseAuth.signOut();
        currentUser = null;
        updateUI();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Payment Functions
function showPaymentModal() {
    const modal = document.getElementById('payment-modal');
    
    if (stripe) {
        setupStripeElements();
    } else {
        console.warn('Stripe not loaded');
    }
    
    showModal(modal);
}

function setupStripeElements() {
    if (!stripe) return;
    
    const elements = stripe.elements();
    const cardElement = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
        },
    });
    
    const stripeContainer = document.getElementById('stripe-elements');
    stripeContainer.innerHTML = '';
    cardElement.mount(stripeContainer);
}

async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    if (!stripe || !currentUser) {
        alert('Error: Stripe no está configurado o usuario no autenticado');
        return;
    }
    
    const submitBtn = e.target;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    
    try {
        // Create a Checkout Session
        // En una implementación real, esto se haría en el servidor para mantener segura la clave secreta
        // Aquí lo hacemos en el cliente para la demostración
        
        const checkoutSession = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Lenguaje USAC - Licencia de por vida',
                            description: 'Acceso completo a todos los módulos educativos',
                            images: ['https://i.ibb.co/QfNMWKM/lenguaje-usac-logo.png'],
                        },
                        unit_amount: 1900, // $19.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: window.location.origin + '?payment=success',
            cancel_url: window.location.origin + '?payment=canceled',
            customer_email: currentUser.email,
            client_reference_id: currentUser.id,
            metadata: {
                user_id: currentUser.id
            }
        };

        // En una implementación real, llamaríamos a un endpoint en nuestro servidor
        console.log('Se enviaría la siguiente sesión a Stripe:', checkoutSession);
        
        // Simular la respuesta de la API de Stripe
        const mockSessionResponse = {
            id: 'cs_test_' + Math.random().toString(36).substring(2, 15),
            url: 'https://checkout.stripe.com/pay/cs_test_mockSession'
        };

        // En un caso real, la redirección sería a la URL proporcionada por Stripe
        // window.location.href = session.url;
        
        // Para demostración, simulamos el proceso exitoso
        alert('En una aplicación real, serías redirigido a la página de pago de Stripe. Aquí simularemos un pago exitoso.');
        
        // Simulate successful payment
        setTimeout(() => {
            alert('¡Pago procesado exitosamente! Ahora tienes acceso completo a todos los módulos.');
            hideModal(document.getElementById('payment-modal'));
            
            // Simular un usuario con acceso premium
            if (!userProgress['comunicacion']) {
                userProgress['comunicacion'] = { completed: 0, points: 50 };
            } else {
                userProgress['comunicacion'].points += 50;
            }
            
            updateUI();
        }, 2000);
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Error al procesar el pago: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Comprar Ahora';
    }
}

// UI Update Functions
function updateUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const hero = document.getElementById('hero');
    const dashboard = document.getElementById('dashboard');
    const modules = document.getElementById('modules');
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        hero.style.display = 'none';
        dashboard.style.display = 'block';
        modules.style.display = 'block';
        
        updateUserStats();
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        hero.style.display = 'block';
        dashboard.style.display = 'none';
        modules.style.display = 'none';
    }
}

function updateUserStats() {
    if (!currentUser) return;
    
    // Calculate progress and stats
    const totalLessons = Object.values(MODULES).reduce((sum, module) => sum + module.lessons.length, 0);
    const completedLessons = Object.values(userProgress).reduce((sum, progress) => sum + (progress.completed || 0), 0);
    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const totalPoints = Object.values(userProgress).reduce((sum, progress) => sum + (progress.points || 0), 0);
    const badgesEarned = Math.floor(totalPoints / 100); // 1 badge per 100 points
    
    // Update display
    document.getElementById('overall-progress').textContent = overallProgress + '%';
    document.getElementById('total-points').textContent = totalPoints;
    document.getElementById('badges-earned').textContent = badgesEarned;
    document.getElementById('user-points').textContent = totalPoints + ' pts';
    
    // Update module progress bars
    Object.keys(MODULES).forEach(moduleKey => {
        const moduleCard = document.querySelector(`[data-module="${moduleKey}"]`);
        if (moduleCard) {
            const progressBar = moduleCard.querySelector('.progress-fill');
            const progressText = moduleCard.querySelector('.progress-text');
            
            const moduleProgress = userProgress[moduleKey];
            const moduleLessons = MODULES[moduleKey].lessons.length;
            const completedInModule = moduleProgress ? moduleProgress.completed : 0;
            const progressPercent = moduleLessons > 0 ? Math.round((completedInModule / moduleLessons) * 100) : 0;
            
            if (progressBar) progressBar.style.width = progressPercent + '%';
            if (progressText) progressText.textContent = progressPercent + '% completado';
        }
    });
}

// Module Functions
function openModule(moduleId) {
    if (!MODULES[moduleId]) return;
    
    currentModule = moduleId;
    currentLesson = 0;
    
    loadModuleContent(moduleId);
    showSection('module-content');
}

function loadModuleContent(moduleId) {
    const module = MODULES[moduleId];
    const moduleTitle = document.getElementById('current-module-title');
    const lessonList = document.getElementById('lesson-list');
    
    moduleTitle.textContent = module.title;
    
    // Create lesson list
    lessonList.innerHTML = '';
    module.lessons.forEach((lesson, index) => {
        const lessonItem = document.createElement('div');
        lessonItem.className = 'lesson-item';
        lessonItem.textContent = lesson.title;
        lessonItem.addEventListener('click', () => loadLesson(index));
        lessonList.appendChild(lessonItem);
    });
    
    // Load first lesson
    loadLesson(0);
}

async function loadLesson(lessonIndex) {
    const module = MODULES[currentModule];
    const lesson = module.lessons[lessonIndex];
    
    currentLesson = lessonIndex;
    
    // Update lesson title
    document.getElementById('current-lesson-title').textContent = lesson.title;
    
    // Load lesson content
    const lessonBody = document.getElementById('lesson-body');
    
    // Check if we have predefined content
    if (LESSON_CONTENT[lesson.content]) {
        lessonBody.innerHTML = LESSON_CONTENT[lesson.content].content;
    } else {
        // Generate content with AI (placeholder for now)
        lessonBody.innerHTML = await generateLessonContent(lesson.title, currentModule);
    }
    
    // Update lesson navigation
    updateLessonNavigation();
    
    // Update active lesson in sidebar
    const lessonItems = document.querySelectorAll('.lesson-item');
    lessonItems.forEach((item, index) => {
        item.classList.toggle('active', index === lessonIndex);
    });
}

async function generateLessonContent(lessonTitle, moduleId) {
    try {
        const startTime = Date.now();
        console.log('🚀 Generando contenido con Gemini AI:', { lessonTitle, moduleId });
        
        const module = MODULES[moduleId];
        if (!module) throw new Error('Módulo no encontrado');
        
        // Verificar si window.aiSdk está disponible
        if (!window.aiSdk || !window.aiSdk.ai) {
            console.error('❌ API Error - AI SDK no está disponible');
            return generatePlaceholderContent(lessonTitle, moduleId);
        }

        // Verificar si la configuración AI está disponible
        if (!window.ywConfig?.ai_config?.lesson_generator) {
            console.error('❌ API Error - Configuración de AI no encontrada');
            return generatePlaceholderContent(lessonTitle, moduleId);
        }
        
        const config = window.ywConfig.ai_config.lesson_generator;
        
        // Extraer tema de la lección
        let topic = lessonTitle;
        if (lessonTitle.includes(':')) {
            topic = lessonTitle.split(':')[1].trim();
        }
        
        // Configuración para el sistema prompt
        const promptVariables = {
            topic: topic,
            module: module.title
        };
        
        // Crear el sistema prompt con las variables
        const systemPrompt = config.system_prompt(promptVariables);
        
        // Log de la solicitud
        console.log('🤖 AI API Request:', {
            model: config.model,
            topic: topic,
            module: module.title,
            systemPrompt: systemPrompt.substring(0, 100) + '...',
            parameters: {
                temperature: config.temperature || 0.7,
                maxTokens: config.maxTokens || 2000
            }
        });

        // Crear el cliente OpenAI
        const openai = window.aiSdk.openai.createOpenAI({
            baseURL: 'https://api.youware.com/public/v1/ai',
            apiKey: 'sk-YOUWARE'
        });

        // Mensaje para generar el contenido
        const userMessage = `Por favor genera contenido educativo para la lección "${lessonTitle}" del módulo "${module.title}" de acuerdo con el programa de la Guía Temática de Lenguaje para el examen de ingreso a la Universidad de San Carlos.`;

        // Generar el contenido
        const { text } = await window.aiSdk.ai.generateText({
            model: openai(config.model),
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 2000
        });
        
        // Log de respuesta exitosa
        console.log('✅ AI API Response:', {
            model: config.model,
            outputLength: text.length,
            responsePreview: text.substring(0, 150) + '...',
            processingTime: `${Date.now() - startTime}ms`
        });

        // Encapsular el contenido en un div con una notificación de IA
        const formattedContent = `
            <h3>${lessonTitle}</h3>
            <div class="ai-notice" style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a73e8;">
                <h4>💡 Contenido Generado por IA</h4>
                <p>Este contenido fue generado por Gemini AI basado en la Guía Temática de la USAC.</p>
            </div>
            <div class="ai-content">
                ${text}
            </div>
        `;

        return formattedContent;
    } catch (error) {
        console.error('❌ API Error - Error generando contenido:', error);
        return generatePlaceholderContent(lessonTitle, moduleId);
    }
}

// Función para generar contenido placeholder cuando AI falla
function generatePlaceholderContent(lessonTitle, moduleId) {
    const module = MODULES[moduleId] || { title: 'Desconocido' };
    
    return `
        <h3>${lessonTitle}</h3>
        <p>Contenido generado para la lección: <strong>${lessonTitle}</strong></p>
        <p>Esta sección del módulo de <strong>${module.title}</strong> está diseñada para proporcionarte una comprensión completa del tema.</p>
        <div class="ai-notice" style="background: #f0f8ff; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1a73e8;">
            <h4>💡 Contenido Educativo</h4>
            <p>El contenido completo estará disponible próximamente.</p>
        </div>
        <h4>Objetivos de Aprendizaje</h4>
        <ul>
            <li>Comprender los conceptos fundamentales</li>
            <li>Aplicar los conocimientos en ejercicios prácticos</li>
            <li>Desarrollar habilidades de análisis crítico</li>
        </ul>
    `;
}

function updateLessonNavigation() {
    const prevBtn = document.getElementById('prev-lesson');
    const nextBtn = document.getElementById('next-lesson');
    const module = MODULES[currentModule];
    
    prevBtn.disabled = currentLesson === 0;
    nextBtn.disabled = currentLesson === module.lessons.length - 1;
    
    nextBtn.onclick = () => {
        if (currentLesson < module.lessons.length - 1) {
            loadLesson(currentLesson + 1);
        }
    };
    
    prevBtn.onclick = () => {
        if (currentLesson > 0) {
            loadLesson(currentLesson - 1);
        }
    };
}

// Quiz Functions
function startQuiz(moduleId) {
    currentModule = moduleId;
    generateQuizData(moduleId);
    showSection('quiz-section');
    loadQuizQuestion(0);
}

async function generateQuizData(moduleId) {
    const module = MODULES[moduleId];
    
    // Inicializar con preguntas básicas por defecto
    quizData = {
        title: module.title,
        currentQuestion: 0,
        questions: [
            {
                question: `¿Cuál es el enfoque principal del módulo de ${module.title}?`,
                options: [
                    'Conceptos básicos y fundamentales',
                    'Aplicación práctica únicamente',
                    'Historia y evolución',
                    'Comparación con otros temas'
                ],
                correct: 0
            },
            {
                question: `¿Cuántas lecciones tiene el módulo de ${module.title}?`,
                options: [
                    `${module.lessons.length - 1} lecciones`,
                    `${module.lessons.length} lecciones`,
                    `${module.lessons.length + 1} lecciones`,
                    `${module.lessons.length + 2} lecciones`
                ],
                correct: 1
            }
        ],
        userAnswers: [],
        score: 0
    };
    
    // Intentar generar preguntas con IA si está disponible
    try {
        if (window.aiSdk && window.aiSdk.ai && window.ywConfig?.ai_config?.quiz_generator) {
            const startTime = Date.now();
            console.log('🚀 Generando quiz con Gemini AI:', { moduleId, moduleTitle: module.title });
            
            const config = window.ywConfig.ai_config.quiz_generator;
            
            // Extraer tema del módulo
            const topic = module.title;
            
            // Configuración para el sistema prompt
            const promptVariables = {
                topic: topic,
                module: module.title,
                numQuestions: 5,
                difficulty: 'intermedio'
            };
            
            // Crear el cliente OpenAI
            const openai = window.aiSdk.openai.createOpenAI({
                baseURL: 'https://api.youware.com/public/v1/ai',
                apiKey: 'sk-YOUWARE'
            });
            
            // Definir un esquema para los datos del quiz
            const quizSchema = window.aiSdk.z.object({
                questions: window.aiSdk.z.array(
                    window.aiSdk.z.object({
                        question: window.aiSdk.z.string(),
                        options: window.aiSdk.z.array(window.aiSdk.z.string()).length(4),
                        correctIndex: window.aiSdk.z.number().min(0).max(3)
                    })
                ).min(3).max(10)
            });
            
            // Mensaje para generar las preguntas del quiz
            const userMessage = `Genera un quiz de 5 preguntas sobre ${topic} para estudiantes que se preparan para el examen de ingreso a la Universidad de San Carlos.`;
            
            console.log('🤖 AI API Request (Quiz):', {
                model: config.model,
                topic: topic,
                parameters: {
                    temperature: config.temperature || 0.3,
                    maxTokens: config.maxTokens || 2000
                }
            });
            
            // Generar el quiz con estructura
            const result = await window.aiSdk.ai.generateObject({
                model: openai(config.model),
                prompt: userMessage,
                schema: quizSchema,
                temperature: config.temperature || 0.3,
                maxTokens: config.maxTokens || 2000,
            });
            
            console.log('✅ AI API Response (Quiz):', {
                model: config.model,
                questionsGenerated: result.object.questions.length,
                processingTime: `${Date.now() - startTime}ms`
            });
            
            // Actualizar el quiz con las preguntas generadas por IA
            quizData.questions = result.object.questions.map(q => ({
                question: q.question,
                options: q.options,
                correct: q.correctIndex
            }));
        }
    } catch (error) {
        console.error('❌ API Error - Quiz generation failed:', error);
        // Si falla, mantenemos las preguntas por defecto
    }
}

function loadQuizQuestion(questionIndex) {
    const question = quizData.questions[questionIndex];
    quizData.currentQuestion = questionIndex;
    
    document.getElementById('quiz-title').textContent = quizData.title;
    document.getElementById('quiz-question-counter').textContent = `${questionIndex + 1} de ${quizData.questions.length}`;
    document.getElementById('quiz-question').textContent = question.question;
    
    // Update progress bar
    const progress = ((questionIndex + 1) / quizData.questions.length) * 100;
    document.getElementById('quiz-progress-fill').style.width = progress + '%';
    
    // Load options
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectQuizOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    // Update navigation
    document.getElementById('quiz-back').disabled = questionIndex === 0;
    document.getElementById('quiz-next').disabled = true;
}

function selectQuizOption(optionIndex) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, index) => {
        option.classList.toggle('selected', index === optionIndex);
    });
    
    quizData.userAnswers[quizData.currentQuestion] = optionIndex;
    document.getElementById('quiz-next').disabled = false;
}

function handleQuizNext() {
    if (quizData.currentQuestion < quizData.questions.length - 1) {
        loadQuizQuestion(quizData.currentQuestion + 1);
    } else {
        finishQuiz();
    }
}

function handleQuizBack() {
    if (quizData.currentQuestion > 0) {
        loadQuizQuestion(quizData.currentQuestion - 1);
    }
}

async function finishQuiz() {
    // Calculate score
    let correctAnswers = 0;
    quizData.questions.forEach((question, index) => {
        if (quizData.userAnswers[index] === question.correct) {
            correctAnswers++;
        }
    });
    
    quizData.score = correctAnswers;
    
    // Show results
    document.querySelector('.quiz-content').style.display = 'none';
    document.querySelector('.quiz-actions').style.display = 'none';
    
    const resultsSection = document.getElementById('quiz-results');
    resultsSection.style.display = 'block';
    
    document.getElementById('quiz-score').textContent = `${correctAnswers}/${quizData.questions.length}`;
    
    // Save quiz result to database
    if (currentUser && supabase) {
        try {
            // For now, we'll use a placeholder unit_id since we don't have the actual unit structure yet
            // This would be replaced with actual unit data when modules are properly loaded
            await saveQuizResult(
                'placeholder-unit-id', 
                Math.round((correctAnswers / quizData.questions.length) * 100),
                quizData.questions.length,
                correctAnswers
            );
        } catch (error) {
            console.error('Error saving quiz result:', error);
        }
    }
    
    // Update local progress
    if (!userProgress[currentModule]) {
        userProgress[currentModule] = { completed: 0, points: 0 };
    }
    userProgress[currentModule].quizScore = quizData.score;
    userProgress[currentModule].points = (userProgress[currentModule].points || 0) + (correctAnswers * 10);
    
    updateUserStats();
}

// Demo Functions
// Asistente IA para estudiantes
async function askAI(question, topic = '', concept = '') {
    try {
        if (!window.aiSdk || !window.aiSdk.ai || !window.ywConfig?.ai_config?.explanation_generator) {
            return "Lo siento, el asistente de IA no está disponible en este momento.";
        }
        
        const startTime = Date.now();
        console.log('🚀 Consultando al asistente de IA:', { question, topic, concept });
        
        const config = window.ywConfig.ai_config.explanation_generator;
        
        // Variables para el sistema prompt
        const promptVariables = {
            concept: concept || 'general',
            topic: topic || 'lenguaje español'
        };
        
        // Crear el cliente OpenAI
        const openai = window.aiSdk.openai.createOpenAI({
            baseURL: 'https://api.youware.com/public/v1/ai',
            apiKey: 'sk-YOUWARE'
        });
        
        // Construir mensajes incluyendo historial de conversación
        const messages = [
            { role: 'system', content: config.system_prompt(promptVariables) },
            ...aiConversationHistory,
            { role: 'user', content: question }
        ];
        
        console.log('🤖 AI API Request (Asistente):', {
            model: config.model,
            messagesCount: messages.length,
            question: question.substring(0, 100) + (question.length > 100 ? '...' : ''),
            parameters: {
                temperature: config.temperature || 0.7,
                maxTokens: config.maxTokens || 1500
            }
        });
        
        // Generar respuesta
        const { text } = await window.aiSdk.ai.generateText({
            model: openai(config.model),
            messages: messages,
            temperature: config.temperature || 0.7,
            maxTokens: config.maxTokens || 1500
        });
        
        console.log('✅ AI API Response (Asistente):', {
            model: config.model,
            outputLength: text.length,
            responsePreview: text.substring(0, 150) + '...',
            processingTime: `${Date.now() - startTime}ms`
        });
        
        // Actualizar historial de conversación
        aiConversationHistory.push({ role: 'user', content: question });
        aiConversationHistory.push({ role: 'assistant', content: text });
        
        // Limitar el historial a las últimas 10 interacciones (5 pares)
        if (aiConversationHistory.length > 10) {
            aiConversationHistory = aiConversationHistory.slice(aiConversationHistory.length - 10);
        }
        
        return text;
    } catch (error) {
        console.error('❌ API Error - Asistente de IA:', error);
        return "Lo siento, hubo un problema al procesar tu pregunta. Por favor intenta de nuevo más tarde.";
    }
}

// Resetear el historial de conversación con IA
function resetAIConversation() {
    aiConversationHistory = [];
}

function showDemoContent() {
    // Simulate logged in user for demo
    currentUser = { email: 'demo@lenguajeusac.com', name: 'Usuario Demo' };
    updateUI();
    
    // Reset AI conversation for the demo
    resetAIConversation();
    
    // Show a sample module
    setTimeout(() => {
        openModule('comunicacion');
    }, 500);
}

// Utility Functions
function showModal(modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showSection(sectionId) {
    const sections = ['hero', 'dashboard', 'modules', 'module-content', 'quiz-section'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

// User Profile and Progress Functions
async function loadUserProfile() {
    if (!currentUser || !supabase) return;
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
            
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error loading profile:', error);
            return;
        }
        
        // Load user progress
        const { data: progress, error: progressError } = await supabase
            .from('user_progress')
            .select(`
                *,
                units (
                    id,
                    title,
                    module_id,
                    modules (
                        id,
                        title
                    )
                )
            `)
            .eq('user_id', currentUser.id);
            
        if (progressError) {
            console.error('Error loading progress:', progressError);
        } else {
            userProgress = {};
            progress?.forEach(p => {
                const moduleTitle = p.units.modules.title.toLowerCase().replace(/\s+/g, '');
                if (!userProgress[moduleTitle]) {
                    userProgress[moduleTitle] = { completed: 0, points: 0 };
                }
                if (p.completed) {
                    userProgress[moduleTitle].completed++;
                    userProgress[moduleTitle].points += 10;
                }
            });
        }
        
    } catch (error) {
        console.error('Error in loadUserProfile:', error);
    }
}

async function loadModulesData() {
    if (!supabase) return;
    
    try {
        const { data: modules, error } = await supabase
            .from('modules')
            .select(`
                *,
                units (*)
            `)
            .order('order_index');
            
        if (error) {
            console.error('Error loading modules:', error);
            return;
        }
        
        // If no modules exist, populate with default data
        if (!modules || modules.length === 0) {
            await populateDefaultModules();
        } else {
            console.log('Modules loaded:', modules.length);
        }
        
    } catch (error) {
        console.error('Error in loadModulesData:', error);
    }
}

async function populateDefaultModules() {
    if (!supabase) return;
    
    const modulesData = [
        { title: 'Comunicación', description: 'Conceptos fundamentales, argumentación y discurso', order_index: 1 },
        { title: 'Lenguaje', description: 'Signo lingüístico, tipos de lenguaje y disciplinas', order_index: 2 },
        { title: 'Ortografía', description: 'Reglas ortográficas, acentuación y puntuación', order_index: 3 },
        { title: 'Gramática y Vocabulario', description: 'Análisis gramatical, categorías y formación de palabras', order_index: 4 },
        { title: 'Exposición Oral y Escrita', description: 'Redacción, tipos de texto y técnicas de comunicación', order_index: 5 },
        { title: 'Comprensión Lectora', description: 'Estrategias de lectura, análisis y figuras literarias', order_index: 6 }
    ];
    
    try {
        const { data, error } = await supabase
            .from('modules')
            .insert(modulesData)
            .select();
            
        if (error) {
            console.error('Error populating modules:', error);
        } else {
            console.log('Default modules created:', data.length);
        }
    } catch (error) {
        console.error('Error in populateDefaultModules:', error);
    }
}

async function saveUserProgress(moduleId, unitId, completed = true) {
    if (!currentUser || !supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('user_progress')
            .upsert([
                {
                    user_id: currentUser.id,
                    unit_id: unitId,
                    completed: completed,
                    completed_at: completed ? new Date().toISOString() : null
                }
            ]);
            
        if (error) {
            console.error('Error saving progress:', error);
        } else {
            console.log('Progress saved successfully');
            await loadUserProfile(); // Refresh progress data
        }
    } catch (error) {
        console.error('Error in saveUserProgress:', error);
    }
}

async function saveQuizResult(unitId, score, totalQuestions, correctAnswers) {
    if (!currentUser || !supabase) return;
    
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .insert([
                {
                    user_id: currentUser.id,
                    unit_id: unitId,
                    score: Math.round((correctAnswers / totalQuestions) * 100),
                    total_questions: totalQuestions,
                    correct_answers: correctAnswers
                }
            ]);
            
        if (error) {
            console.error('Error saving quiz result:', error);
        } else {
            console.log('Quiz result saved successfully');
        }
    } catch (error) {
        console.error('Error in saveQuizResult:', error);
    }
}

// Función para generar ruta de aprendizaje personalizada
async function generateLearningPath(moduleId, level = 'intermedio', strengths = [], weaknesses = []) {
    try {
        if (!window.aiSdk || !window.aiSdk.ai || !window.ywConfig?.ai_config?.learning_path) {
            return "Lo siento, la generación de rutas de aprendizaje no está disponible en este momento.";
        }
        
        const startTime = Date.now();
        const module = MODULES[moduleId];
        if (!module) throw new Error('Módulo no encontrado');
        
        console.log('🚀 Generando ruta de aprendizaje:', { moduleId, level, strengths, weaknesses });
        
        const config = window.ywConfig.ai_config.learning_path;
        
        // Variables para el sistema prompt
        const promptVariables = {
            module: module.title,
            topic: 'general', // Se puede especificar más adelante
            level: level,
            strengths: strengths.join(', ') || 'no especificadas',
            weaknesses: weaknesses.join(', ') || 'no especificadas'
        };
        
        // Crear el cliente OpenAI
        const openai = window.aiSdk.openai.createOpenAI({
            baseURL: 'https://api.youware.com/public/v1/ai',
            apiKey: 'sk-YOUWARE'
        });
        
        const userMessage = `Por favor genera una ruta de aprendizaje personalizada para el módulo "${module.title}" adaptada a un estudiante de nivel ${level}.`;
        
        console.log('🤖 AI API Request (Ruta Aprendizaje):', {
            model: config.model,
            module: module.title,
            parameters: {
                temperature: config.temperature || 0.4,
                maxTokens: config.maxTokens || 2500
            }
        });
        
        // Generar ruta de aprendizaje
        const { text } = await window.aiSdk.ai.generateText({
            model: openai(config.model),
            messages: [
                { role: 'system', content: config.system_prompt(promptVariables) },
                { role: 'user', content: userMessage }
            ],
            temperature: config.temperature || 0.4,
            maxTokens: config.maxTokens || 2500
        });
        
        console.log('✅ AI API Response (Ruta Aprendizaje):', {
            model: config.model,
            outputLength: text.length,
            responsePreview: text.substring(0, 150) + '...',
            processingTime: `${Date.now() - startTime}ms`
        });
        
        return text;
    } catch (error) {
        console.error('❌ API Error - Generación de ruta de aprendizaje:', error);
        return "Lo siento, hubo un problema al generar la ruta de aprendizaje. Por favor intenta de nuevo más tarde.";
    }
}

// Export functions for potential external use
window.LenguajeUSAC = {
    openModule,
    startQuiz,
    showDemoContent,
    updateUI,
    loadUserProfile,
    saveUserProgress,
    saveQuizResult,
    askAI,
    resetAIConversation,
    generateLearningPath
};