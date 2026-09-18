/// ===== SHARED FUNCTIONS =====
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showMessage(text, type, form) {
  // Remove existing messages
  const existingMessages = form.querySelectorAll(".message");
  existingMessages.forEach((msg) => msg.remove());

  // Create new message
  const messageElement = document.createElement("div");
  messageElement.className = `message ${type}`;
  messageElement.textContent = text;

  // Add to form
  form.appendChild(messageElement);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageElement.remove();
  }, 5000);
}

function togglePassword(passwordInput, eyeIcon) {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.textContent = "🔒";
  } else {
    passwordInput.type = "password";
    eyeIcon.textContent = "👁️";
  }
}

// ===== TIME-BASED GREETING FUNCTION =====
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good day";
  return "Good evening";
}

// ===== LOGIN PAGE FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", function () {
  // Login Page Elements
  const loginForm = document.getElementById("loginForm");
  const loginEmailInput = document.getElementById("userEmail");
  const loginPasswordInput = document.getElementById("password");
  const loginTogglePassword = document.querySelector(
    "#loginForm .toggle-password"
  );
  const loginBtn = document.getElementById("loginBtn");

  // Signup Page Elements
  const signupForm = document.getElementById("signupForm");
  const signupTogglePassword = document.querySelector(
    "#signupForm .toggle-password"
  );
  const signupPasswordInput = signupForm
    ? signupForm.querySelector('input[type="password"]')
    : null;
  const termsCheckbox = document.getElementById("terms");

  // ===== LOGIN PAGE CODE =====
  if (loginForm) {
    // Real-time validation for login form
    if (loginEmailInput) {
      loginEmailInput.addEventListener("input", validateLoginEmail);
    }

    if (loginPasswordInput) {
      loginPasswordInput.addEventListener("input", validateLoginPassword);
    }

    // Password toggle for login
    if (loginTogglePassword && loginPasswordInput) {
      loginTogglePassword.addEventListener("click", function () {
        togglePassword(loginPasswordInput, loginTogglePassword);
      });
    }

    // Form submission - UPDATED WITH LOCALSTORAGE AUTH
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate fields
      const isEmailValid = validateLoginEmail();
      const isPasswordValid = validateLoginPassword();

      if (isEmailValid && isPasswordValid) {
        // Show loading state
        loginBtn.classList.add("loading");
        loginBtn.querySelector(".btn-text").style.display = "none";
        loginBtn.querySelector(".loading-spinner").style.display = "block";

        // Get form data
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // ✅ CHECK AGAINST LOCALSTORAGE USER DATA
        const storedUser = localStorage.getItem("studyStreamUser");

        if (storedUser) {
          const userData = JSON.parse(storedUser);

          if (userData.email === email && userData.password === password) {
            showMessage(
              "Login successful! Redirecting to dashboard...",
              "success",
              loginForm
            );

            // Store login state
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(userData));

            // Redirect to dashboard
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 1500);
          } else {
            showMessage(
              "Invalid credentials. Please try again.",
              "error",
              loginForm
            );
            loginForm.classList.add("shake");
            setTimeout(() => loginForm.classList.remove("shake"), 500);
          }
        } else {
          showMessage(
            "No account found. Please sign up first.",
            "error",
            loginForm
          );
          loginForm.classList.add("shake");
          setTimeout(() => loginForm.classList.remove("shake"), 500);
        }

        // Reset button state
        loginBtn.classList.remove("loading");
        loginBtn.querySelector(".btn-text").style.display = "block";
        loginBtn.querySelector(".loading-spinner").style.display = "none";
      } else {
        loginForm.classList.add("shake");
        setTimeout(() => loginForm.classList.remove("shake"), 500);
      }
    });

    // Initialize validation if fields have values
    if (loginEmailInput && loginEmailInput.value) validateLoginEmail();
    if (loginPasswordInput && loginPasswordInput.value) validateLoginPassword();
  }

  // ===== SIGNUP PAGE CODE =====
  if (signupForm) {
    // Real-time validation for signup form
    const inputs = signupForm.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        validateSignupField(this);
      });

      input.addEventListener("blur", function () {
        validateSignupField(this);
      });
    });

    // Password toggle for signup
    if (signupTogglePassword && signupPasswordInput) {
      signupTogglePassword.addEventListener("click", function () {
        togglePassword(signupPasswordInput, signupTogglePassword);
      });
    }

    // Form submission
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate all fields before submission
      let isValid = true;
      const inputs = signupForm.querySelectorAll("input");
      inputs.forEach((input) => {
        if (!validateSignupField(input)) {
          isValid = false;
        }
      });

      if (termsCheckbox && !termsCheckbox.checked) {
        showMessage(
          "Please agree to the terms and conditions",
          "error",
          signupForm
        );
        isValid = false;
      }

      if (isValid) {
        simulateSignup();
      } else {
        signupForm.classList.add("shake");
        setTimeout(() => signupForm.classList.remove("shake"), 500);
      }
    });
  }

  // ===== DASHBOARD FUNCTIONALITY =====
  if (document.querySelector(".dashboard-body")) {
    initializeDashboard();
  }
});

// ===== LOGIN VALIDATION FUNCTIONS =====
function validateLoginEmail() {
  const emailInput = document.getElementById("userEmail");
  const emailValidation = document.getElementById("emailValidation");
  const email = emailInput.value;

  if (email === "") {
    resetValidation(emailInput, emailValidation);
    return false;
  } else if (isValidEmail(email)) {
    setValid(emailInput, emailValidation, "Email looks good!");
    return true;
  } else {
    setInvalid(
      emailInput,
      emailValidation,
      "Please enter a valid email address"
    );
    return false;
  }
}

function validateLoginPassword() {
  const passwordInput = document.getElementById("password");
  const passwordValidation = document.getElementById("passwordValidation");
  const password = passwordInput.value;

  if (password === "") {
    resetValidation(passwordInput, passwordValidation);
    return false;
  } else if (password.length < 6) {
    setInvalid(
      passwordInput,
      passwordValidation,
      "Password must be at least 6 characters"
    );
    return false;
  } else {
    setValid(passwordInput, passwordValidation, "Password is strong!");
    return true;
  }
}

function resetLoginValidation() {
  const emailInput = document.getElementById("userEmail");
  const passwordInput = document.getElementById("password");
  const emailValidation = document.getElementById("emailValidation");
  const passwordValidation = document.getElementById("passwordValidation");

  resetValidation(emailInput, emailValidation);
  resetValidation(passwordInput, passwordValidation);
}

// ===== SIGNUP VALIDATION FUNCTIONS =====
function validateSignupField(field) {
  const value = field.value.trim();
  let isValid = true;
  let message = "";

  switch (field.type) {
    case "text":
      if (field.placeholder.includes("Name")) {
        if (value === "") {
          isValid = false;
          message = "This field is required";
        } else if (value.length < 2) {
          isValid = false;
          message = "Name must be at least 2 characters";
        }
      }
      break;

    case "email":
      if (value === "") {
        isValid = false;
        message = "Email is required";
      } else if (!isValidEmail(value)) {
        isValid = false;
        message = "Please enter a valid email address";
      }
      break;

    case "password":
      if (value === "") {
        isValid = false;
        message = "Password is required";
      } else if (value.length < 6) {
        isValid = false;
        message = "Password must be at least 6 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        isValid = false;
        message = "Include uppercase, lowercase, and numbers";
      }
      break;
  }

  // Update field styling
  field.classList.remove("valid", "invalid");
  if (value !== "") {
    field.classList.add(isValid ? "valid" : "invalid");
  }

  // Show validation message
  let messageElement = field.parentElement.querySelector(".validation-message");
  if (!messageElement) {
    messageElement = document.createElement("div");
    messageElement.className = "validation-message";
    field.parentElement.appendChild(messageElement);
  }

  messageElement.textContent = message;
  messageElement.classList.remove("valid", "invalid");
  if (value !== "") {
    messageElement.classList.add(isValid ? "valid" : "invalid");
  }

  return isValid;
}

function simulateSignup() {
  const signupForm = document.getElementById("signupForm");
  const signupButton = signupForm.querySelector(".login-button");
  const buttonText = signupButton.querySelector(".btn-text");
  const loadingSpinner = signupButton.querySelector(".loading-spinner");

  // ✅ GET FORM DATA FOR LOCALSTORAGE
  const firstName = signupForm.querySelector(
    'input[placeholder="First Name"]'
  ).value;
  const lastName = signupForm.querySelector(
    'input[placeholder="Last Name"]'
  ).value;
  const email = signupForm.querySelector(
    'input[placeholder="Email Address"]'
  ).value;
  const password = signupForm.querySelector(
    'input[placeholder="Create Password"]'
  ).value;

  // Show loading state
  signupButton.classList.add("loading");
  buttonText.style.display = "none";
  loadingSpinner.style.display = "block";

  // Simulate API call
  setTimeout(() => {
    const isSuccess = Math.random() > 0.2; // 80% success rate for demo

    if (isSuccess) {
      // ✅ STORE USER DATA IN LOCALSTORAGE
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password, // Note: In real app, never store plain passwords!
        createdAt: new Date().toISOString(),
        scholarLevel: "Level 3 Scholar", // Default level
        studyStreak: 14,
        totalHours: 142.5,
        achievements: 23,
      };
      localStorage.setItem("studyStreamUser", JSON.stringify(userData));

      showMessage(
        "Account created successfully! Redirecting to login...",
        "success",
        signupForm
      );

      // Redirect to login page after success
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      showMessage(
        "Email already exists. Please try another one.",
        "error",
        signupForm
      );
      signupForm.classList.add("shake");
      setTimeout(() => signupForm.classList.remove("shake"), 500);
    }

    // Reset button state
    signupButton.classList.remove("loading");
    buttonText.style.display = "block";
    loadingSpinner.style.display = "none";
  }, 2000);
}

// ===== SHARED VALIDATION FUNCTIONS =====
function setValid(input, messageElement, text) {
  input.classList.add("valid");
  input.classList.remove("invalid");
  if (messageElement) {
    messageElement.textContent = text;
    messageElement.classList.add("valid");
    messageElement.classList.remove("invalid");
  }
}

function setInvalid(input, messageElement, text) {
  input.classList.add("invalid");
  input.classList.remove("valid");
  if (messageElement) {
    messageElement.textContent = text;
    messageElement.classList.add("invalid");
    messageElement.classList.remove("valid");
  }
}

function resetValidation(input, messageElement) {
  input.classList.remove("valid", "invalid");
  if (messageElement) {
    messageElement.textContent = "";
    messageElement.classList.remove("valid", "invalid");
  }
}

// Google Login Button (for both pages)
const googleLoginBtn = document.getElementById("googleLogin");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", function () {
    this.classList.add("loading");
    this.innerHTML =
      '<span class="loading-spinner">⏳</span>Connecting to Google...';

    setTimeout(() => {
      alert("This would redirect to Google OAuth login.");
      this.innerHTML = '<span class="google-icon">G</span>Log in with Google';
      this.classList.remove("loading");
    }, 1500);
  });
}

// ===== DASHBOARD FUNCTIONALITY =====
function initializeDashboard() {
  // Check authentication
  checkAuthentication();

  // Initialize all dashboard features
  initializeNavigation();
  initializeRoomActions();
  initializeQuickActions();
  initializeUserProfile();
  initializeStats();
  initializeSchedule();
  initializeRealTimeUpdates();
}

// ===== AUTHENTICATION CHECK =====
function checkAuthentication() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");

  if (!isLoggedIn || !currentUser) {
    window.location.href = "index.html";
    return;
  }

  // Update user info in dashboard
  try {
    const userData = JSON.parse(currentUser);
    updateUserInfo(userData);
  } catch (error) {
    console.error("Error parsing user data:", error);
    window.location.href = "index.html";
  }
}

function updateUserInfo(userData) {
  // Update user name in header - USING DYNAMIC GREETING
  const headerTitle = document.querySelector(".header-title");
  if (headerTitle && userData.firstName) {
    headerTitle.textContent = `${getTimeBasedGreeting()}, ${
      userData.firstName
    } ${userData.lastName || ""}! 🌟`;
  }

  // Update user avatar and name in sidebar
  const userName = document.querySelector(".user-name");
  const userLevel = document.querySelector(".user-level");
  const userAvatar = document.querySelector(".user-avatar");

  if (userName && userData.firstName) {
    userName.textContent = `${userData.firstName} ${userData.lastName || ""}`;
  }

  if (userLevel && userData.scholarLevel) {
    userLevel.textContent = userData.scholarLevel;
  }

  if (userAvatar && userData.firstName && userData.lastName) {
    userAvatar.textContent =
      `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
  }
}

// ===== PAGE NAVIGATION SYSTEM =====
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const logoutBtn = document.querySelector(".logout-btn");

  // Store original dashboard content
  const originalDashboardContent =
    document.querySelector(".dashboard-content").outerHTML;

  // Navigation click handlers
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      navItems.forEach((nav) => nav.classList.remove("active"));
      // Add active class to clicked item
      this.classList.add("active");

      // Handle navigation based on which item was clicked
      const navText = this.querySelector("span").textContent;
      handlePageNavigation(navText, originalDashboardContent);
    });
  });

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function handlePageNavigation(section, originalDashboardContent) {
  switch (section) {
    case "Dashboard":
      loadDashboardPage(originalDashboardContent);
      break;
    case "Study Rooms":
      loadStudyRoomsPage();
      break;
    case "My Notes":
      loadNotesPage();
      break;
    case "Progress":
      loadProgressPage();
      break;
    case "Challenges":
      loadChallengesPage();
      break;
    case "Goals":
      loadGoalsPage();
      break;
    case "Pomodoro":
      loadPomodoroPage();
      break;
    case "Chat":
      loadChatPage();
      break;
    case "Settings":
      loadSettingsPage();
      break;
    default:
      console.log(`Navigating to: ${section}`);
      showDashboardNotification(`Navigating to ${section}`, "info");
  }
}

function loadDashboardPage(originalContent) {
  // SHOW the dashboard header again (in case it was hidden)
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "flex";

  // Restore original dashboard content
  const newContent = document.createElement("div");
  newContent.className = "dashboard-content";
  newContent.innerHTML = originalContent;

  // Replace content while keeping header
  const existingContent = document.querySelector(".dashboard-content");
  if (existingContent) {
    existingContent.replaceWith(newContent);
  }

  // Show create room button
  const createRoomBtn = document.querySelector(".create-room-btn");
  if (createRoomBtn) createRoomBtn.style.display = "flex";

  // Update header - USING DYNAMIC GREETING
  const headerTitle = document.querySelector(".header-title");
  const headerSubtitle = document.querySelector(".header-subtitle");
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (headerTitle && userData.firstName) {
    headerTitle.textContent = `${getTimeBasedGreeting()}, ${
      userData.firstName
    } ${userData.lastName || ""}! 🌟`;
  }
  if (headerSubtitle)
    headerSubtitle.textContent = "Ready to crush your study goals today?";

  // Re-initialize dashboard functionality
  initializeRoomActions();
  initializeQuickActions();
  initializeStats();
  initializeSchedule();

  showDashboardNotification("Welcome back to Dashboard!", "success");
}

// ===== STUDY ROOMS PAGE FUNCTIONALITY =====
function loadStudyRoomsPage() {
  // SHOW the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "flex";

  // Update header - ONLY ONE HEADING
  const headerTitle = document.querySelector(".header-title");
  const headerSubtitle = document.querySelector(".header-subtitle");

  if (headerTitle) headerTitle.textContent = "Study Rooms";
  if (headerSubtitle)
    headerSubtitle.textContent = "Collaborate and learn together in real-time";

  // Show create room button
  const createRoomBtn = document.querySelector(".create-room-btn");
  if (createRoomBtn) {
    createRoomBtn.style.display = "flex";
    createRoomBtn.innerHTML = `
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      Create Room
    `;
  }

  // Load study rooms content
  const studyRoomsContent = initializeStudyRoomsPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = studyRoomsContent;
  }

  // Initialize study rooms functionality
  initializeStudyRoomsFunctionality();

  showDashboardNotification("Study Rooms loaded successfully!", "success");
}

function initializeStudyRoomsPage() {
  return `
    <div class="study-rooms-container">
      <div class="room-filter-bar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="Search study rooms..." id="roomSearch">
        </div>
        <div class="room-filters">
          <span class="filter-option" data-filter="public">⚪ Public</span>
          <span class="filter-option" data-filter="private">🔒 Private</span>
          <span class="filter-option" data-filter="live">🔴 Live</span>
        </div>
      </div>

      <nav class="room-tabs">
        <button class="tab-btn active" data-tab="all-rooms">All Rooms</button>
        <button class="tab-btn" data-tab="my-rooms">My Rooms</button>
        <button class="tab-btn" data-tab="recently-joined">Recently Joined</button>
      </nav>

      <div id="all-rooms-content" class="tab-pane active">
        <div class="room-listings">
          <!-- Calculus Study Group -->
          <section class="room-card live" data-room-id="1" data-subject="mathematics" data-type="public" data-status="live">
            <div class="room-details">
              <h2 class="room-title">Calculus Study Group</h2>
              <div class="room-tags">
                <span class="subject-tag">Mathematics</span>
                <span class="visibility-tag public">public</span>
              </div>
              <p class="current-activity">
                Current Activity: Working on integration problems for final exam
              </p>

              <div class="participants">
                <span>4/8 participants</span>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 50%"></div>
                </div>
                <div class="participant-avatars">
                  <span>SW</span><span>MC</span><span>ED</span><span>AT</span>
                </div>
              </div>

              <div class="host">Hosted by Sarah Wilson</div>
              <div class="shared-resources">Shared Resources: Calculus_Notes.pdf, Practice_Problems.docx</div>
              <div class="available-features">
                Available Features: 📹 Video/Audio, ⬜ Whiteboard, 🖥️ Screen Sharing, 💬 Live Chat
              </div>
              <div class="room-timing">2h 30m</div>
              <button class="join-room-btn" data-room-id="1">Join Room</button>
            </div>

            <div class="room-action-area">
              <div class="current-activity-detail">
                Current Activity
                <p>Working on integration problems for final exam</p>
              </div>
              <div class="resources-list">
                Resources
                <ul>
                  <li>Calculus_Notes.pdf</li>
                  <li>Practice_Problems.docx</li>
                </ul>
              </div>
              <div class="share-chat-buttons">
                <button class="secondary-action">💬 Chat</button>
                <button class="secondary-action">🔗 Share</button>
              </div>
            </div>
          </section>

          <!-- React Deep Dive -->
          <section class="room-card live" data-room-id="2" data-subject="programming" data-type="public" data-status="live">
            <div class="room-details">
              <h2 class="room-title">React Deep Dive</h2>
              <div class="room-tags">
                <span class="subject-tag">Programming</span>
                <span class="visibility-tag public">public</span>
              </div>
              <p class="current-activity">
                Current Activity: Building a full-stack application with hooks
              </p>

              <div class="participants">
                <span>6/10 participants</span>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 60%"></div>
                </div>
                <div class="participant-avatars">
                  <span>KM</span><span>LP</span><span>DK</span><span>AB</span>
                </div>
              </div>

              <div class="host">Hosted by Alex Chen</div>
              <div class="shared-resources">Shared Resources: React_Hooks_Guide.md, Project_Setup.zip</div>
              <div class="available-features">
                Available Features: 📹 Video/Audio, ⬜ Whiteboard, 🖥️ Screen Sharing, 💬 Live Chat
              </div>
              <div class="room-timing">1h 45m</div>
              <button class="join-room-btn" data-room-id="2">Join Room</button>
            </div>

            <div class="room-action-area">
              <div class="current-activity-detail">
                Current Activity
                <p>Building a full-stack application with hooks</p>
              </div>
              <div class="resources-list">
                Resources
                <ul>
                  <li>React_Hooks_Guide.md</li>
                  <li>Project_Setup.zip</li>
                </ul>
              </div>
              <div class="share-chat-buttons">
                <button class="secondary-action">💬 Chat</button>
                <button class="secondary-action">🔗 Share</button>
              </div>
            </div>
          </section>

          <!-- Physics Lab Prep -->
          <section class="room-card private" data-room-id="3" data-subject="physics" data-type="private" data-status="upcoming">
            <div class="room-details">
              <h2 class="room-title">Physics Lab Prep</h2>
              <div class="room-tags">
                <span class="subject-tag">Physics</span>
                <span class="visibility-tag private">private</span>
              </div>
              <p class="current-activity">
                Current Activity: Preparing for quantum mechanics lab session
              </p>

              <div class="participants">
                <span>2/6 participants</span>
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 33%"></div>
                </div>
                <div class="participant-avatars">
                  <span>KM</span><span>SA</span>
                </div>
              </div>

              <div class="host">Hosted by Maria Rodriguez</div>
              <div class="shared-resources">Shared Resources: Lab_Manual.pdf, Quantum_Notes.docx</div>
              <div class="available-features">
                Available Features: 📹 Video/Audio, ⬜ Whiteboard, 🖥️ Screen Sharing, 💬 Live Chat
              </div>
              <div class="room-timing">3h 0m</div>
              <button class="starting-soon-btn">Starting Soon</button>
            </div>

            <div class="room-action-area">
              <div class="current-activity-detail">
                Current Activity
                <p>Preparing for quantum mechanics lab session</p>
              </div>
              <div class="resources-list">
                Resources
                <ul>
                  <li>Lab_Manual.pdf</li>
                  <li>Quantum_Notes.docx</li>
                </ul>
              </div>
              <div class="share-chat-buttons">
                <button class="secondary-action">💬 Chat</button>
                <button class="secondary-action">🔗 Share</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div id="my-rooms-content" class="tab-pane">
        <section class="room-card private" data-room-id="3" data-subject="physics" data-type="private" data-status="upcoming">
          <div class="room-details">
            <h2 class="room-title">Physics Lab Prep</h2>
            <div class="room-tags">
              <span class="subject-tag">Physics</span>
              <span class="visibility-tag private">private</span>
            </div>
            <p class="current-activity">
              Current Activity: Preparing for quantum mechanics lab session
            </p>

            <div class="participants">
              <span>2/6 participants</span>
              <div class="progress-bar-container">
                <div class="progress-bar" style="width: 33%"></div>
              </div>
              <div class="participant-avatars">
                <span>KM</span><span>SA</span>
              </div>
            </div>

            <div class="host">Hosted by Maria Rodriguez</div>
            <div class="shared-resources">Shared Resources: Lab_Manual.pdf, Quantum_Notes.docx</div>
            <div class="available-features">
              Available Features: 📹 Video/Audio, ⬜ Whiteboard, 🖥️ Screen Sharing, 💬 Live Chat
            </div>
            <div class="room-timing">3h 0m</div>
            <button class="starting-soon-btn">Starting Soon</button>
          </div>

          <div class="room-action-area">
            <div class="current-activity-detail">
              Current Activity
              <p>Preparing for quantum mechanics lab session</p>
            </div>
            <div class="resources-list">
              Resources
              <ul>
                <li>Lab_Manual.pdf</li>
                <li>Quantum_Notes.docx</li>
              </ul>
            </div>
            <div class="share-chat-buttons">
              <button class="secondary-action">💬 Chat</button>
              <button class="secondary-action">🔗 Share</button>
            </div>
          </div>
        </section>
      </div>

      <div id="recently-joined-content" class="tab-pane">
        <div class="empty-state-container">
          <div class="empty-state-card">
            <span class="clock-icon">⌚</span>
            <p>No recently joined rooms</p>
          </div>
        </div>
      </div>

      <div class="global-room-features">
        <h2>Room Features</h2>
        <div class="features-list">
          <span class="feature-item">📹 Video & Audio</span>
          <span class="feature-item">🖥️ Screen Sharing</span>
          <span class="feature-item">💬 Live Chat</span>
          <span class="feature-item">✋ Raise Hand</span>
        </div>
      </div>
    </div>
  `;
}

function initializeStudyRoomsFunctionality() {
  // Initialize tabs
  const tabBtns = document.querySelectorAll(".room-tabs .tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and panes
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked tab and corresponding pane
      this.classList.add("active");
      document.getElementById(`${targetTab}-content`).classList.add("active");

      showDashboardNotification(`Showing ${this.textContent}`, "info");
    });
  });

  // Initialize search
  const searchInput = document.getElementById("roomSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      const roomCards = document.querySelectorAll(".room-card");

      roomCards.forEach((card) => {
        const roomTitle = card
          .querySelector(".room-title")
          .textContent.toLowerCase();
        const roomSubject = card.getAttribute("data-subject");
        const roomDescription = card
          .querySelector(".current-activity")
          .textContent.toLowerCase();

        if (
          roomTitle.includes(searchTerm) ||
          roomSubject.includes(searchTerm) ||
          roomDescription.includes(searchTerm)
        ) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Initialize filters
  const filterOptions = document.querySelectorAll(".filter-option");
  filterOptions.forEach((option) => {
    option.addEventListener("click", function () {
      this.classList.toggle("active");
      filterRooms();
    });
  });

  // Initialize room actions
  initializeRoomJoinButtons();
  initializeCreateRoomButton();
}

function filterRooms() {
  const roomCards = document.querySelectorAll(".room-card");
  const activeFilters = document.querySelectorAll(".filter-option.active");

  roomCards.forEach((card) => {
    const roomType = card.getAttribute("data-type");
    const roomStatus = card.getAttribute("data-status");

    let shouldShow = true;

    if (activeFilters.length > 0) {
      shouldShow = false;
      activeFilters.forEach((filter) => {
        const filterValue = filter.getAttribute("data-filter");
        if (
          (filterValue === "public" && roomType === "public") ||
          (filterValue === "private" && roomType === "private") ||
          (filterValue === "live" && roomStatus === "live")
        ) {
          shouldShow = true;
        }
      });
    }

    card.style.display = shouldShow ? "flex" : "none";
  });
}

function initializeRoomJoinButtons() {
  const joinButtons = document.querySelectorAll(".join-room-btn");

  joinButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const roomCard = this.closest(".room-card");
      const roomTitle = roomCard.querySelector(".room-title").textContent;

      // Show loading state
      const originalText = this.textContent;
      this.innerHTML = '<span class="loading-spinner">⏳</span> Joining...';
      this.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Update participant count
        const participantCount = roomCard.querySelector(".participants span");
        const countText = participantCount.textContent;
        const [current, max] = countText
          .split("/")
          .map((num) => parseInt(num.trim()));

        if (current < max) {
          participantCount.textContent = `${current + 1}/${max} participants`;

          // Update progress bar
          const progressBar = roomCard.querySelector(".progress-bar");
          const newWidth = ((current + 1) / max) * 100;
          progressBar.style.width = `${newWidth}%`;

          showDashboardNotification(
            `Joined ${roomTitle} successfully!`,
            "success"
          );
        } else {
          showDashboardNotification(`Room ${roomTitle} is full!`, "error");
        }

        // Reset button
        this.textContent = originalText;
        this.disabled = false;
      }, 1500);
    });
  });
}

function initializeCreateRoomButton() {
  const createBtn = document.querySelector(".create-room-btn");
  if (createBtn) {
    createBtn.addEventListener("click", function () {
      showDashboardNotification("Create Room feature coming soon!", "info");
    });
  }
}

// ===== NOTES PAGE FUNCTIONALITY =====
function loadNotesPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load notes content
  const notesContent = initializeNotesPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = notesContent;
  }

  // Initialize notes functionality
  initializeNotesFunctionality();

  showDashboardNotification("Notes page loaded successfully!", "success");
}

function initializeNotesPage() {
  return `
    <div class="notes-container">
      <header class="notes-header">
        <div>
          <h1 class="notes-title">My Study Notes</h1>
          <p class="notes-subtitle">Organize and access your study materials</p>
        </div>
        <button class="create-note-btn">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Note
        </button>
      </header>

      <div class="notes-toolbar">
        <div class="search-container">
          <input type="text" class="search-input" placeholder="Search notes...">
          <svg class="search-icon icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div class="notes-filters">
          <select class="filter-select" id="subjectFilter">
            <option value="all">All Subjects</option>
            <option value="mathematics">Mathematics</option>
            <option value="physics">Physics</option>
            <option value="programming">Programming</option>
            <option value="chemistry">Chemistry</option>
            <option value="javascript">JavaScript</option>
            <option value="csharp">C#</option>
          </select>
          <select class="sort-select" id="sortFilter">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div class="notes-grid" id="notesGrid">
        <!-- Notes will be dynamically generated here -->
      </div>
    </div>
  `;
}

function initializeNotesFunctionality() {
  // Initialize notes data
  const notesData = [
    {
      id: 1,
      title: "Calculus Integration Formulas",
      subject: "mathematics",
      preview:
        "Basic integration rules, substitution method, and common integral formulas with examples...",
      date: "2 days ago",
      words: "1,245",
    },
    {
      id: 2,
      title: "React Hooks Guide",
      subject: "programming",
      preview:
        "Complete guide to React Hooks: useState, useEffect, useContext, custom hooks with practical examples...",
      date: "1 week ago",
      words: "2,340",
    },
    {
      id: 3,
      title: "Thermodynamics Laws",
      subject: "physics",
      preview:
        "The four laws of thermodynamics explained with real-world applications and problem-solving techniques...",
      date: "3 days ago",
      words: "890",
    },
    {
      id: 4,
      title: "Python Data Structures",
      subject: "programming",
      preview:
        "Lists, dictionaries, tuples, sets - when to use each and performance characteristics for different operations...",
      date: "2 weeks ago",
      words: "1,567",
    },
    {
      id: 5,
      title: "JavaScript ES6 Features",
      subject: "javascript",
      preview:
        "Arrow functions, destructuring, template literals, and modern JavaScript syntax for better coding...",
      date: "5 days ago",
      words: "1,890",
    },
    {
      id: 6,
      title: "C# Object-Oriented Programming",
      subject: "csharp",
      preview:
        "Classes, inheritance, polymorphism, and encapsulation in C# with practical examples and best practices...",
      date: "1 week ago",
      words: "2,100",
    },
    {
      id: 7,
      title: "Linear Algebra Basics",
      subject: "mathematics",
      preview:
        "Vectors, matrices, determinants, and linear transformations with applications in computer graphics...",
      date: "4 days ago",
      words: "1,450",
    },
    {
      id: 8,
      title: "Quantum Mechanics Introduction",
      subject: "physics",
      preview:
        "Wave-particle duality, Schrödinger equation, and quantum states explained for beginners...",
      date: "6 days ago",
      words: "1,780",
    },
    {
      id: 9,
      title: "Organic Chemistry Reactions",
      subject: "chemistry",
      preview:
        "Common organic reactions, mechanisms, and functional group transformations with examples...",
      date: "3 days ago",
      words: "1,230",
    },
  ];

  // Render notes
  renderNotes(notesData);

  // Initialize search
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterAndSortNotes();
    });
  }

  // Initialize filters
  const subjectFilter = document.getElementById("subjectFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (subjectFilter) {
    subjectFilter.addEventListener("change", filterAndSortNotes);
  }

  if (sortFilter) {
    sortFilter.addEventListener("change", filterAndSortNotes);
  }

  // Initialize create note button
  const createNoteBtn = document.querySelector(".create-note-btn");
  if (createNoteBtn) {
    createNoteBtn.addEventListener("click", createNewNote);
  }
}

function renderNotes(notes) {
  const notesGrid = document.getElementById("notesGrid");
  if (!notesGrid) return;

  notesGrid.innerHTML = "";

  notes.forEach((note) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
      <div class="note-header">
        <h3 class="note-title">${note.title}</h3>
        <span class="note-subject ${note.subject}">${getSubjectDisplayName(
      note.subject
    )}</span>
      </div>
      <p class="note-preview">${note.preview}</p>
      <div class="note-meta">
        <span class="note-date">Created: ${note.date}</span>
        <span class="note-length">• ${note.words} words</span>
      </div>
      <div class="note-actions">
        <button class="note-btn edit-btn">Edit</button>
        <button class="note-btn view-btn">View</button>
        <button class="note-btn share-btn">Share</button>
      </div>
    `;
    notesGrid.appendChild(noteCard);
  });

  // Add new note card at the end
  const newNoteCard = document.createElement("div");
  newNoteCard.className = "note-card new-note-card";
  newNoteCard.innerHTML = `
    <div class="new-note-content">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="48" height="48">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <p>Create New Note</p>
    </div>
  `;
  newNoteCard.addEventListener("click", createNewNote);
  notesGrid.appendChild(newNoteCard);
}

function getSubjectDisplayName(subject) {
  const subjects = {
    mathematics: "Mathematics",
    physics: "Physics",
    programming: "Programming",
    chemistry: "Chemistry",
    javascript: "JavaScript",
    csharp: "C#",
  };
  return subjects[subject] || subject;
}

function filterAndSortNotes() {
  const searchInput = document.querySelector(".search-input");
  const subjectFilter = document.getElementById("subjectFilter");
  const sortFilter = document.getElementById("sortFilter");

  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  const selectedSubject = subjectFilter ? subjectFilter.value : "all";
  const sortBy = sortFilter ? sortFilter.value : "newest";

  // In a real app, you would filter from the original data
  // For now, we'll simulate filtering
  let filteredNotes = [
    {
      id: 1,
      title: "Calculus Integration Formulas",
      subject: "mathematics",
      preview:
        "Basic integration rules, substitution method, and common integral formulas with examples...",
      date: "2 days ago",
      words: "1,245",
    },
    {
      id: 2,
      title: "React Hooks Guide",
      subject: "programming",
      preview:
        "Complete guide to React Hooks: useState, useEffect, useContext, custom hooks with practical examples...",
      date: "1 week ago",
      words: "2,340",
    },
    {
      id: 3,
      title: "Thermodynamics Laws",
      subject: "physics",
      preview:
        "The four laws of thermodynamics explained with real-world applications and problem-solving techniques...",
      date: "3 days ago",
      words: "890",
    },
    {
      id: 4,
      title: "Python Data Structures",
      subject: "programming",
      preview:
        "Lists, dictionaries, tuples, sets - when to use each and performance characteristics for different operations...",
      date: "2 weeks ago",
      words: "1,567",
    },
    {
      id: 5,
      title: "JavaScript ES6 Features",
      subject: "javascript",
      preview:
        "Arrow functions, destructuring, template literals, and modern JavaScript syntax for better coding...",
      date: "5 days ago",
      words: "1,890",
    },
    {
      id: 6,
      title: "C# Object-Oriented Programming",
      subject: "csharp",
      preview:
        "Classes, inheritance, polymorphism, and encapsulation in C# with practical examples and best practices...",
      date: "1 week ago",
      words: "2,100",
    },
    {
      id: 7,
      title: "Linear Algebra Basics",
      subject: "mathematics",
      preview:
        "Vectors, matrices, determinants, and linear transformations with applications in computer graphics...",
      date: "4 days ago",
      words: "1,450",
    },
    {
      id: 8,
      title: "Quantum Mechanics Introduction",
      subject: "physics",
      preview:
        "Wave-particle duality, Schrödinger equation, and quantum states explained for beginners...",
      date: "6 days ago",
      words: "1,780",
    },
    {
      id: 9,
      title: "Organic Chemistry Reactions",
      subject: "chemistry",
      preview:
        "Common organic reactions, mechanisms, and functional group transformations with examples...",
      date: "3 days ago",
      words: "1,230",
    },
  ];

  // Filter by search term
  if (searchTerm) {
    filteredNotes = filteredNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm) ||
        note.preview.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by subject
  if (selectedSubject !== "all") {
    filteredNotes = filteredNotes.filter(
      (note) => note.subject === selectedSubject
    );
  }

  // Sort notes
  switch (sortBy) {
    case "newest":
      // Simulate newest first (by ID for demo)
      filteredNotes.sort((a, b) => b.id - a.id);
      break;
    case "oldest":
      // Simulate oldest first (by ID for demo)
      filteredNotes.sort((a, b) => a.id - b.id);
      break;
    case "alphabetical":
      filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  renderNotes(filteredNotes);
}

function createNewNote() {
  const newNote = {
    id: Date.now(), // Unique ID based on timestamp
    title: "New Study Note",
    subject: "programming",
    preview: "Start typing your notes here... This is a new note you created.",
    date: "Just now",
    words: "0",
  };

  showDashboardNotification("New note created successfully!", "success");

  // In a real app, you would add to the data array and re-render
  // For now, we'll just show a notification
}

// ===== PROGRESS PAGE FUNCTIONALITY =====
function loadProgressPage() {
  // HIDE the entire dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Hide create room button
  const createRoomBtn = document.querySelector(".create-room-btn");
  if (createRoomBtn) createRoomBtn.style.display = "none";

  // Load progress content
  const progressContent = initializeProgressPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = progressContent;
  }

  // Initialize progress functionality
  initializeProgressFunctionality();

  showDashboardNotification("Progress dashboard loaded!", "success");
}

function initializeProgressPage() {
  return `
    <div class="progress-container">
      <header class="progress-header">
        <div>
          <h1>Progress</h1>
          <p>Track your learning journey and achievements</p>
        </div>
        <button class="share-progress-btn">
          <i class="fa-solid fa-arrow-up-from-bracket"></i>Share Progress
        </button>
      </header>

      <div class="progress-stats-grid">
        <div class="progress-stat-card">
          <i class="fa-solid fa-fire"></i>
          <div class="progress-stat-value">14</div>
          <div class="progress-stat-label">Study Streak</div>
          <div class="progress-stat-subtext">Days in a row 🔥</div>
        </div>
        <div class="progress-stat-card">
          <i class="fa-solid fa-clock"></i>
          <div class="progress-stat-value">142.5</div>
          <div class="progress-stat-label">Total Hours</div>
          <div class="progress-stat-subtext">This month</div>
        </div>
        <div class="progress-stat-card">
          <i class="fa-solid fa-brain"></i>
          <div class="progress-stat-value">58</div>
          <div class="progress-stat-label">Sessions</div>
          <div class="progress-stat-subtext">This month</div>
        </div>
        <div class="progress-stat-card">
          <i class="fa-solid fa-trophy"></i>
          <div class="progress-stat-value">23</div>
          <div class="progress-stat-label">Achievements</div>
          <div class="progress-stat-subtext">Badges earned</div>
        </div>
      </div>

      <div class="progress-tabs">
        <input type="radio" id="tab-overview" name="tabs" checked>
        <input type="radio" id="tab-weekly" name="tabs">
        <input type="radio" id="tab-subject" name="tabs">
        <input type="radio" id="tab-achievements" name="tabs">

        <div class="tabs-bar">
          <label for="tab-overview" class="tab">Overview</label>
          <label for="tab-weekly" class="tab">Weekly</label>
          <label for="tab-subject" class="tab">By Subject</label>
          <label for="tab-achievements" class="tab">Achievements</label>
        </div>

        <div class="tab-content">
          <!-- Overview Panel -->
          <div id="overview-panel" class="tab-panel">
            <div class="progress-main">
              <div class="progress-left">
                <div class="week-container">
                  <h4>This Week<i class="fa fa-area-chart" style="margin-left: 10px; color: #3b82f6; font-size: 16px;"></i></h4>
                  <div class="day-progress">
                    <span>Mon</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="70"></div>
                    </div>
                    <span>3.5h +2s</span>
                  </div>
                  <div class="day-progress">
                    <span>Tue</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="80"></div>
                    </div>
                    <span>4.2h +3s</span>
                  </div>
                  <div class="day-progress">
                    <span>Wed</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="55"></div>
                    </div>
                    <span>2.8h +2s</span>
                  </div>
                  <div class="day-progress">
                    <span>Thu</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="95"></div>
                    </div>
                    <span>5.1h +4s</span>
                  </div>
                  <div class="day-progress">
                    <span>Fri</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="75"></div>
                    </div>
                    <span>3.9h +3s</span>
                  </div>
                  <div class="day-progress">
                    <span>Sat</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="100"></div>
                    </div>
                    <span>6.2h +4s</span>
                  </div>
                  <div class="day-progress">
                    <span>Sun</span>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill" data-width="55"></div>
                    </div>
                    <span>2.8h +2s</span>
                  </div>
                </div>
              </div>

              <div class="progress-insights">
                <h3><i class="fa-solid fa-arrow-trend-up"></i>Study Insights</h3>
                <div class="insight-item">
                  <span>Peak Focus Time</span>
                  <div class="insight-value">8:00 PM - 10:00 PM</div>
                </div>
                <div class="insight-item">
                  <span>Best Study Day</span>
                  <div class="insight-value">Saturday</div>
                </div>
                <div class="insight-item">
                  <span>Average Session</span>
                  <div class="insight-value">1.2 hours</div>
                </div>
                <div class="insight-item">
                  <span>Completion Rate</span>
                  <div class="insight-value">87%</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Panel -->
          <div id="weekly-panel" class="tab-panel">
            <div class="weekly-dashboard">
              <div class="weekly-summary">
                <h2>Weekly Summary
                  <i class="fas fa-calendar-alt" style="color: #8b5cf6; margin-left: 10px;"></i>
                </h2>
                <div class="goal-progress">
                  <p>Study Hours</p>
                  <div class="weekly-progress-bar">
                    <div class="weekly-progress-fill" data-width="81.43">
                      <span>28.5 / 35</span>
                    </div>
                  </div>
                </div>
                <div class="goal-progress">
                  <p>Sessions</p>
                  <div class="weekly-progress-bar">
                    <div class="weekly-progress-fill" data-width="80">
                      <span>20 / 25</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="weekly-highlights">
                <h3>This Week's Highlights</h3>
                <ul>
                  <li><span class="highlight-dot dot-green"></span>Longest session: 3.5 hours</li>
                  <li><span class="highlight-dot dot-blue"></span>Most productive day: Thursday</li>
                  <li><span class="highlight-dot dot-purple"></span>Study rooms joined: 8</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Subject Panel -->
          <div id="subject-panel" class="tab-panel">
            <div class="subject-holder">
              <h2>Subject Breakdown</h2>
              <div class="subject-bars">
                <div class="subject-labels">
                  <span>Mathematics</span>
                  <span>12.5h (35%)</span>
                </div>
                <div class="subject-progressing">
                  <span class="math-progress" data-width="35"></span>
                </div>
              </div>
              <div class="subject-bars">
                <div class="subject-labels">
                  <span>Physics</span>
                  <span>8.2h (23%)</span>
                </div>
                <div class="subject-progressing">
                  <span class="physics-progress" data-width="23"></span>
                </div>
              </div>
              <div class="subject-bars">
                <div class="subject-labels">
                  <span>Programming</span>
                  <span>10.1h (28%)</span>
                </div>
                <div class="subject-progressing">
                  <span class="programming-progress" data-width="28"></span>
                </div>
              </div>
              <div class="subject-bars">
                <div class="subject-labels">
                  <span>Chemistry</span>
                  <span>5h (14%)</span>
                </div>
                <div class="subject-progressing">
                  <span class="chemistry-progress" data-width="14"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Achievements Panel -->
          <div id="achievements-panel" class="tab-panel">
            <div class="achievements-grid">
              <div class="achievement-card">
                <div class="achievement-icon">🔥</div>
                <div class="achievement-title">Study Streak Master</div>
                <div class="achievement-subtitle">14-day study streak</div>
                <div class="achievement-badge">Earned</div>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">🦉</div>
                <div class="achievement-title">Night Owl</div>
                <div class="achievement-subtitle">Study after 10 PM</div>
                <div class="achievement-badge">Earned</div>
              </div>
              <div class="achievement-card locked">
                <div class="achievement-icon">🌅</div>
                <div class="achievement-title">Early Bird</div>
                <div class="achievement-subtitle">Study before 7 AM</div>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">🏃‍♂️</div>
                <div class="achievement-title">Marathon Learner</div>
                <div class="achievement-subtitle">6+ hours in one day</div>
                <div class="achievement-badge">Earned</div>
              </div>
              <div class="achievement-card locked">
                <div class="achievement-icon">👥</div>
                <div class="achievement-title">Social Learner</div>
                <div class="achievement-subtitle">Join 10 study rooms</div>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">🎯</div>
                <div class="achievement-title">Goal Crusher</div>
                <div class="achievement-subtitle">Complete 5 goals</div>
                <div class="achievement-badge">Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeProgressFunctionality() {
  // Initialize all progress features
  animateProgressBars();
  initializeProgressTabs();
  initializeShareProgress();
  initializeAchievementSystem();
  updateProgressData();

  // Load from URL hash if present
  const hash = window.location.hash.replace("#", "");
  if (hash && document.getElementById(hash)) {
    document.getElementById(hash).checked = true;
  }
}

function animateProgressBars() {
  // Animate weekly progress bars
  const progressBars = document.querySelectorAll(".progress-bar-fill");

  progressBars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width") + "%";
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 300);
  });

  // Animate subject progress bars
  const subjectBars = document.querySelectorAll(".subject-progressing span");

  subjectBars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width") + "%";
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 500);
  });

  // Animate weekly goal progress bars
  const weeklyBars = document.querySelectorAll(".weekly-progress-fill");

  weeklyBars.forEach((bar) => {
    const targetWidth = bar.getAttribute("data-width") + "%";
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 700);
  });
}

function initializeProgressTabs() {
  const tabs = document.querySelectorAll('.progress-tabs input[type="radio"]');

  tabs.forEach((tab) => {
    tab.addEventListener("change", function () {
      // Add smooth transitions between tabs
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.style.opacity = "0";
        setTimeout(() => {
          panel.style.opacity = "1";
          panel.style.transition = "opacity 0.3s ease";
        }, 150);
      });

      // Re-animate progress bars when switching tabs
      setTimeout(() => {
        animateProgressBars();
      }, 200);

      // Update URL hash for deep linking
      window.location.hash = this.id;
    });
  });
}

function initializeShareProgress() {
  const shareBtn = document.querySelector(".share-progress-btn");

  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

      const shareText = `Check out my study progress on StudyStream! 📚
🔥 ${userData.studyStreak || 14}-day streak
⏱️ ${userData.totalHours || 142.5} total hours
🎯 ${userData.achievements || 23} achievements earned

Join me at: ${window.location.origin}`;

      if (navigator.share) {
        navigator
          .share({
            title: "My StudyStream Progress",
            text: shareText,
            url: window.location.href,
          })
          .then(() => {
            showDashboardNotification(
              "Progress shared successfully!",
              "success"
            );
          });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            showDashboardNotification(
              "Progress copied to clipboard!",
              "success"
            );
          })
          .catch(() => {
            // Final fallback: show text
            prompt("Copy your progress to share:", shareText);
          });
      }
    });
  }
}

function initializeAchievementSystem() {
  const achievementCards = document.querySelectorAll(".achievement-card");

  achievementCards.forEach((card) => {
    card.addEventListener("click", function () {
      if (this.classList.contains("locked")) {
        const title = this.querySelector(".achievement-title").textContent;
        showDashboardNotification(
          `🔒 ${title} - Keep studying to unlock!`,
          "info"
        );
      } else {
        const title = this.querySelector(".achievement-title").textContent;
        showDashboardNotification(
          `🎉 ${title} - Achievement earned!`,
          "success"
        );
      }
    });
  });
}

function updateProgressData() {
  // Update with user data from localStorage
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  // Update stat cards if user data exists
  if (userData.studyStreak) {
    const streakElement = document.querySelector(
      ".progress-stat-card:nth-child(1) .progress-stat-value"
    );
    if (streakElement) streakElement.textContent = userData.studyStreak;
  }

  if (userData.totalHours) {
    const hoursElement = document.querySelector(
      ".progress-stat-card:nth-child(2) .progress-stat-value"
    );
    if (hoursElement) hoursElement.textContent = userData.totalHours;
  }

  // Simulate real-time updates
  setInterval(() => {
    simulateProgressUpdates();
  }, 30000);
}

function simulateProgressUpdates() {
  // Randomly update study streak (1% chance every 30 seconds)
  if (Math.random() < 0.01) {
    const streakElement = document.querySelector(
      ".progress-stat-card:nth-child(1) .progress-stat-value"
    );
    if (streakElement) {
      const currentStreak = parseInt(streakElement.textContent);
      streakElement.textContent = currentStreak + 1;

      // Update user data in localStorage
      const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
      userData.studyStreak = currentStreak + 1;
      localStorage.setItem("currentUser", JSON.stringify(userData));

      showDashboardNotification("🔥 Study streak increased!", "success");
    }
  }

  // Random achievement unlock (0.5% chance)
  if (Math.random() < 0.005) {
    const lockedCards = document.querySelectorAll(".achievement-card.locked");
    if (lockedCards.length > 0) {
      const randomCard =
        lockedCards[Math.floor(Math.random() * lockedCards.length)];
      randomCard.classList.remove("locked");
      randomCard.style.background =
        "linear-gradient(135deg, #3b82f6, #8b5cf6) !important";

      const badge = document.createElement("div");
      badge.className = "achievement-badge";
      badge.textContent = "Earned";
      randomCard.querySelector(".achievement-subtitle").after(badge);

      const title = randomCard.querySelector(".achievement-title").textContent;
      showDashboardNotification(`🎉 New achievement: ${title}`, "success");
    }
  }
}

// ===== CHALLENGES PAGE FUNCTIONALITY =====
function loadChallengesPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load challenges content
  const challengesContent = initializeChallengesPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = challengesContent;
  }

  // Initialize challenges functionality
  initializeChallengesFunctionality();

  showDashboardNotification("Challenges loaded successfully!", "success");
}

function initializeChallengesPage() {
  return `
    <div class="challenges-container">
      <header class="challenges-header">
        <div>
          <h1>Study Challenges</h1>
          <p>Push your limits and earn rewards</p>
        </div>
        <div class="challenges-stats">
          <div class="challenge-stat">
            <span class="stat-value">8</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="challenge-stat">
            <span class="stat-value">5</span>
            <span class="stat-label">In Progress</span>
          </div>
          <div class="challenge-stat">
            <span class="stat-value">12</span>
            <span class="stat-label">Available</span>
          </div>
        </div>
      </header>

      <div class="challenges-tabs">
        <button class="challenge-tab active" data-tab="daily">Daily Challenges</button>
        <button class="challenge-tab" data-tab="weekly">Weekly Challenges</button>
        <button class="challenge-tab" data-tab="achievements">Achievements</button>
      </div>

      <div class="challenges-content">
        <!-- Daily Challenges -->
        <div class="tab-content active" id="daily-challenges">
          <div class="challenges-grid">
            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Morning Study Session</h3>
                <span class="challenge-points">+50 pts</span>
              </div>
              <p class="challenge-description">Study for at least 1 hour before 12 PM</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 75%"></div>
                </div>
                <span>45/60 min</span>
              </div>
              <button class="challenge-btn in-progress">Continue</button>
            </div>

            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Complete 3 Study Sessions</h3>
                <span class="challenge-points">+100 pts</span>
              </div>
              <p class="challenge-description">Finish 3 separate study sessions today</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 66%"></div>
                </div>
                <span>2/3 sessions</span>
              </div>
              <button class="challenge-btn in-progress">Continue</button>
            </div>

            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Join a Study Room</h3>
                <span class="challenge-points">+75 pts</span>
              </div>
              <p class="challenge-description">Collaborate with others in a study room</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 0%"></div>
                </div>
                <span>0/1 rooms</span>
              </div>
              <button class="challenge-btn start">Start Challenge</button>
            </div>

            <div class="challenge-card completed">
              <div class="challenge-header">
                <h3>Daily Login</h3>
                <span class="challenge-points">+25 pts</span>
              </div>
              <p class="challenge-description">Log in to StudyStream today</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 100%"></div>
                </div>
                <span>Completed! 🎉</span>
              </div>
              <button class="challenge-btn completed" disabled>Completed</button>
            </div>
          </div>
        </div>

        <!-- Weekly Challenges -->
        <div class="tab-content" id="weekly-challenges">
          <div class="challenges-grid">
            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Study Marathon</h3>
                <span class="challenge-points">+300 pts</span>
              </div>
              <p class="challenge-description">Complete 15 hours of study this week</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 60%"></div>
                </div>
                <span>9/15 hours</span>
              </div>
              <button class="challenge-btn in-progress">Continue</button>
            </div>

            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Subject Master</h3>
                <span class="challenge-points">+250 pts</span>
              </div>
              <p class="challenge-description">Study 5 different subjects this week</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 40%"></div>
                </div>
                <span>2/5 subjects</span>
              </div>
              <button class="challenge-btn in-progress">Continue</button>
            </div>

            <div class="challenge-card">
              <div class="challenge-header">
                <h3>Study Streak</h3>
                <span class="challenge-points">+200 pts</span>
              </div>
              <p class="challenge-description">Study for 7 consecutive days</p>
              <div class="challenge-progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" style="width: 85%"></div>
                </div>
                <span>6/7 days</span>
              </div>
              <button class="challenge-btn in-progress">Continue</button>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="tab-content" id="achievements-challenges">
          <div class="achievements-grid">
            <div class="achievement-card large">
              <div class="achievement-icon">🔥</div>
              <div class="achievement-info">
                <h3>Study Streak Master</h3>
                <p>Maintain a 30-day study streak</p>
                <div class="achievement-progress">
                  <span>14/30 days</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 47%"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="achievement-card large">
              <div class="achievement-icon">📚</div>
              <div class="achievement-info">
                <h3>Bookworm</h3>
                <p>Complete 100 study sessions</p>
                <div class="achievement-progress">
                  <span>58/100 sessions</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 58%"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="achievement-card large">
              <div class="achievement-icon">🌟</div>
              <div class="achievement-info">
                <h3>Rising Star</h3>
                <p>Reach Level 5 Scholar</p>
                <div class="achievement-progress">
                  <span>Level 3/5</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 60%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeChallengesFunctionality() {
  // Initialize challenge tabs
  const challengeTabs = document.querySelectorAll(".challenge-tab");
  const tabContents = document.querySelectorAll(".tab-content");

  challengeTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      challengeTabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      this.classList.add("active");
      document
        .getElementById(`${targetTab}-challenges`)
        .classList.add("active");
    });
  });

  // Initialize challenge buttons
  const challengeBtns = document.querySelectorAll(".challenge-btn");
  challengeBtns.forEach((btn) => {
    if (!btn.disabled) {
      btn.addEventListener("click", function () {
        const challengeCard = this.closest(".challenge-card");
        const challengeTitle = challengeCard.querySelector("h3").textContent;

        if (this.classList.contains("start")) {
          this.textContent = "In Progress";
          this.classList.remove("start");
          this.classList.add("in-progress");
          showDashboardNotification(`Started: ${challengeTitle}`, "success");
        } else if (this.classList.contains("in-progress")) {
          // Simulate progress update
          const progressBar = challengeCard.querySelector(".progress-bar");
          const currentWidth = parseInt(progressBar.style.width);
          const newWidth = Math.min(currentWidth + 25, 100);
          progressBar.style.width = `${newWidth}%`;

          if (newWidth === 100) {
            this.textContent = "Completed!";
            this.classList.remove("in-progress");
            this.classList.add("completed");
            this.disabled = true;
            challengeCard.classList.add("completed");
            showDashboardNotification(
              `Completed: ${challengeTitle}! 🎉`,
              "success"
            );
          } else {
            showDashboardNotification(
              `Progress updated: ${challengeTitle}`,
              "info"
            );
          }
        }
      });
    }
  });
}

// ===== GOALS PAGE FUNCTIONALITY =====
function loadGoalsPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load goals content
  const goalsContent = initializeGoalsPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = goalsContent;
  }

  // Initialize goals functionality
  initializeGoalsFunctionality();

  showDashboardNotification("Goals loaded successfully!", "success");
}

function initializeGoalsPage() {
  return `
    <div class="goals-container">
      <header class="goals-header">
        <div>
          <h1>Study Goals</h1>
          <p>Track your achievements and set new targets</p>
        </div>
        <div class="goals-summary">
          <div class="goal-stat">
            <span class="stat-value">12</span>
            <span class="stat-label">Achieved</span>
          </div>
          <div class="goal-stat">
            <span class="stat-value">8</span>
            <span class="stat-label">In Progress</span>
          </div>
          <div class="goal-stat">
            <span class="stat-value">15</span>
            <span class="stat-label">Available</span>
          </div>
        </div>
      </header>

      <div class="goals-categories">
        <div class="category active" data-category="achieved">
          <span class="category-icon">✅</span>
          <span>Achieved Goals</span>
        </div>
        <div class="category" data-category="progress">
          <span class="category-icon">🎯</span>
          <span>Goals in Progress</span>
        </div>
        <div class="category" data-category="available">
          <span class="category-icon">🌟</span>
          <span>Available Goals</span>
        </div>
      </div>

      <div class="goals-content">
        <!-- Achieved Goals -->
        <div class="goals-section active" id="achieved-goals">
          <div class="goals-grid">
            <div class="goal-card achieved">
              <div class="goal-icon">🔓</div>
              <div class="goal-info">
                <h3>First Login</h3>
                <p>Successfully logged into StudyStream</p>
                <span class="goal-date">Achieved today</span>
              </div>
              <div class="goal-badge">✅</div>
            </div>

            <div class="goal-card achieved">
              <div class="goal-icon">📊</div>
              <div class="goal-info">
                <h3>Progress Explorer</h3>
                <p>Visited the Progress dashboard section</p>
                <span class="goal-date">Achieved today</span>
              </div>
              <div class="goal-badge">✅</div>
            </div>

            <div class="goal-card achieved">
              <div class="goal-icon">📝</div>
              <div class="goal-info">
                <h3>Note Taker</h3>
                <p>Created your first study note</p>
                <span class="goal-date">Achieved today</span>
              </div>
              <div class="goal-badge">✅</div>
            </div>

            <div class="goal-card achieved">
              <div class="goal-icon">🔥</div>
              <div class="goal-info">
                <h3>Weekly Streak</h3>
                <p>Maintained 7-day study streak</p>
                <span class="goal-date">Achieved 2 days ago</span>
              </div>
              <div class="goal-badge">✅</div>
            </div>
          </div>
        </div>

        <!-- Goals in Progress -->
        <div class="goals-section" id="progress-goals">
          <div class="goals-grid">
            <div class="goal-card in-progress">
              <div class="goal-icon">🏆</div>
              <div class="goal-info">
                <h3>Challenge Champion</h3>
                <p>Complete 5 weekly challenges</p>
                <div class="goal-progress">
                  <span>3/5 challenges</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 60%"></div>
                  </div>
                </div>
              </div>
              <div class="goal-progress-indicator">60%</div>
            </div>

            <div class="goal-card in-progress">
              <div class="goal-icon">⏰</div>
              <div class="goal-info">
                <h3>Time Master</h3>
                <p>Reach 50 total study hours</p>
                <div class="goal-progress">
                  <span>28.5/50 hours</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 57%"></div>
                  </div>
                </div>
              </div>
              <div class="goal-progress-indicator">57%</div>
            </div>

            <div class="goal-card in-progress">
              <div class="goal-icon">📚</div>
              <div class="goal-info">
                <h3>Subject Specialist</h3>
                <p>Master 3 different subjects</p>
                <div class="goal-progress">
                  <span>2/3 subjects</span>
                  <div class="progress-bar-container">
                    <div class="progress-bar" style="width: 66%"></div>
                  </div>
                </div>
              </div>
              <div class="goal-progress-indicator">66%</div>
            </div>
          </div>
        </div>

        <!-- Available Goals -->
        <div class="goals-section" id="available-goals">
          <div class="goals-grid">
            <div class="goal-card available">
              <div class="goal-icon">🎓</div>
              <div class="goal-info">
                <h3>Scholar Level Up</h3>
                <p>Reach Level 5 Scholar status</p>
                <span class="goal-requirement">Current: Level 3</span>
              </div>
              <button class="goal-start-btn">Start</button>
            </div>

            <div class="goal-card available">
              <div class="goal-icon">👥</div>
              <div class="goal-info">
                <h3>Study Buddy</h3>
                <p>Join 10 different study rooms</p>
                <span class="goal-requirement">Current: 4 rooms</span>
              </div>
              <button class="goal-start-btn">Start</button>
            </div>

            <div class="goal-card available">
              <div class="goal-icon">💪</div>
              <div class="goal-info">
                <h3>Marathon Learner</h3>
                <p>Complete a 4-hour study session</p>
                <span class="goal-requirement">Best: 2.5 hours</span>
              </div>
              <button class="goal-start-btn">Start</button>
            </div>
          </div>
        </div>
      </div>

      <div class="more-goals-section">
        <h3>More Goals to Achieve</h3>
        <div class="upcoming-goals">
          <div class="upcoming-goal">
            <span class="goal-emoji">🌅</span>
            <span>Early Bird - Study before 7 AM</span>
          </div>
          <div class="upcoming-goal">
            <span class="goal-emoji">🦉</span>
            <span>Night Owl - Study after 10 PM</span>
          </div>
          <div class="upcoming-goal">
            <span class="goal-emoji">📖</span>
            <span>Bookworm - Read 10 study materials</span>
          </div>
          <div class="upcoming-goal">
            <span class="goal-emoji">🎯</span>
            <span>Perfect Week - Complete all daily goals</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeGoalsFunctionality() {
  // Initialize goal categories
  const categories = document.querySelectorAll(".category");
  const goalSections = document.querySelectorAll(".goals-section");

  categories.forEach((category) => {
    category.addEventListener("click", function () {
      const targetCategory = this.getAttribute("data-category");

      // Remove active class from all categories and sections
      categories.forEach((c) => c.classList.remove("active"));
      goalSections.forEach((s) => s.classList.remove("active"));

      // Add active class to clicked category and corresponding section
      this.classList.add("active");
      document
        .getElementById(`${targetCategory}-goals`)
        .classList.add("active");
    });
  });

  // Initialize goal start buttons
  const startBtns = document.querySelectorAll(".goal-start-btn");
  startBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const goalCard = this.closest(".goal-card");
      const goalTitle = goalCard.querySelector("h3").textContent;

      // Move goal to in-progress section
      goalCard.classList.remove("available");
      goalCard.classList.add("in-progress");
      this.remove();

      // Add progress elements
      const goalInfo = goalCard.querySelector(".goal-info");
      const progressHtml = `
        <div class="goal-progress">
          <span>0% complete</span>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: 0%"></div>
          </div>
        </div>
      `;
      goalInfo.innerHTML += progressHtml;

      goalCard.innerHTML += `<div class="goal-progress-indicator">0%</div>`;

      showDashboardNotification(`Started working on: ${goalTitle}`, "success");
    });
  });
}

// ===== POMODORO PAGE FUNCTIONALITY =====
function loadPomodoroPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load pomodoro content
  const pomodoroContent = initializePomodoroPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = pomodoroContent;
  }

  // Initialize pomodoro functionality
  initializePomodoroFunctionality();

  showDashboardNotification("Pomodoro Timer ready!", "success");
}

function initializePomodoroPage() {
  return `
    <div class="pomodoro-container">
      <header class="pomodoro-header">
        <div>
          <h1>Pomodoro Timer</h1>
          <p>Focus and boost your productivity</p>
        </div>
        <div class="pomodoro-stats">
          <div class="pomodoro-stat">
            <span class="stat-value">4</span>
            <span class="stat-label">Sessions Today</span>
          </div>
          <div class="pomodoro-stat">
            <span class="stat-value">2h 15m</span>
            <span class="stat-label">Focus Time</span>
          </div>
          <div class="pomodoro-stat">
            <span class="stat-value">3</span>
            <span class="stat-label">Day Streak</span>
          </div>
        </div>
      </header>

      <div class="pomodoro-main">
        <div class="timer-container">
          <div class="timer-circle">
            <div class="timer-progress">
              <svg class="progress-ring" width="300" height="300">
                <circle class="progress-ring-circle" stroke-width="8" fill="transparent" r="140" cx="150" cy="150"/>
              </svg>
              <div class="timer-display">
                <div class="timer-time" id="timerDisplay">25:00</div>
                <div class="timer-label" id="timerLabel">Focus Session</div>
              </div>
            </div>
          </div>
          
          <div class="timer-controls">
            <button class="timer-btn primary" id="startTimer">Start</button>
            <button class="timer-btn secondary" id="pauseTimer" disabled>Pause</button>
            <button class="timer-btn secondary" id="resetTimer">Reset</button>
          </div>
        </div>

        <div class="pomodoro-settings">
          <div class="session-types">
            <h3>Session Type</h3>
            <div class="session-buttons">
              <button class="session-btn active" data-minutes="25">Focus (25m)</button>
              <button class="session-btn" data-minutes="5">Short Break (5m)</button>
              <button class="session-btn" data-minutes="15">Long Break (15m)</button>
            </div>
          </div>

          <div class="custom-session">
            <h3>Custom Session</h3>
            <div class="custom-input">
              <input type="number" id="customMinutes" min="1" max="60" value="25">
              <span>minutes</span>
            </div>
            <button class="custom-btn" id="setCustom">Set Custom</button>
          </div>

          <div class="session-history">
            <h3>Today's Sessions</h3>
            <div class="sessions-list">
              <div class="session-item completed">
                <span class="session-type">Focus</span>
                <span class="session-duration">25:00</span>
                <span class="session-time">9:00 AM</span>
              </div>
              <div class="session-item completed">
                <span class="session-type">Break</span>
                <span class="session-duration">5:00</span>
                <span class="session-time">9:25 AM</span>
              </div>
              <div class="session-item completed">
                <span class="session-type">Focus</span>
                <span class="session-duration">25:00</span>
                <span class="session-time">9:30 AM</span>
              </div>
              <div class="session-item current">
                <span class="session-type">Focus</span>
                <span class="session-duration">15:32</span>
                <span class="session-time">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pomodoro-features">
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h4>Focus Mode</h4>
          <p>Block distractions and stay focused</p>
          <button class="feature-btn">Enable</button>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h4>Ambient Sounds</h4>
          <p>Background noise for better concentration</p>
          <button class="feature-btn">Select</button>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h4>Productivity Stats</h4>
          <p>Track your focus patterns and progress</p>
          <button class="feature-btn">View</button>
        </div>
      </div>
    </div>
  `;
}

function initializePomodoroFunctionality() {
  let timer;
  let timeLeft = 25 * 60; // 25 minutes in seconds
  let isRunning = false;
  let currentSessionType = "focus";

  const timerDisplay = document.getElementById("timerDisplay");
  const timerLabel = document.getElementById("timerLabel");
  const startBtn = document.getElementById("startTimer");
  const pauseBtn = document.getElementById("pauseTimer");
  const resetBtn = document.getElementById("resetTimer");
  const sessionBtns = document.querySelectorAll(".session-btn");
  const customBtn = document.getElementById("setCustom");

  // Format time as MM:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  // Update timer display
  function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);

    // Update progress ring (simplified)
    const progressRing = document.querySelector(".progress-ring-circle");
    if (progressRing) {
      const circumference = 2 * Math.PI * 140;
      const totalTime =
        currentSessionType === "focus"
          ? 25 * 60
          : currentSessionType === "short"
          ? 5 * 60
          : 15 * 60;
      const progress = ((totalTime - timeLeft) / totalTime) * circumference;
      progressRing.style.strokeDasharray = `${progress} ${circumference}`;
    }
  }

  // Start timer
  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;

      timer = setInterval(() => {
        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
          clearInterval(timer);
          isRunning = false;
          startBtn.disabled = false;
          pauseBtn.disabled = true;

          // Play notification sound (in real app)
          showDashboardNotification(
            "Session completed! Time for a break?",
            "success"
          );
        }
      }, 1000);
    }
  }

  // Pause timer
  function pauseTimer() {
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }

  // Reset timer
  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;

    // Reset to current session type
    switch (currentSessionType) {
      case "focus":
        timeLeft = 25 * 60;
        break;
      case "short":
        timeLeft = 5 * 60;
        break;
      case "long":
        timeLeft = 15 * 60;
        break;
    }

    updateDisplay();
  }

  // Set session type
  function setSessionType(minutes, type, label) {
    sessionBtns.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");

    currentSessionType = type;
    timeLeft = minutes * 60;
    timerLabel.textContent = label;
    updateDisplay();
    resetTimer();
  }

  // Event listeners
  startBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  sessionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const minutes = parseInt(this.getAttribute("data-minutes"));
      const type = minutes === 25 ? "focus" : minutes === 5 ? "short" : "long";
      const label = this.textContent;
      setSessionType(minutes, type, label);
    });
  });

  customBtn.addEventListener("click", function () {
    const customMinutes = parseInt(
      document.getElementById("customMinutes").value
    );
    if (customMinutes && customMinutes > 0 && customMinutes <= 60) {
      timeLeft = customMinutes * 60;
      timerLabel.textContent = `Custom Session (${customMinutes}m)`;
      updateDisplay();
      resetTimer();
      showDashboardNotification(
        `Custom timer set for ${customMinutes} minutes`,
        "success"
      );
    }
  });

  // Initialize display
  updateDisplay();
}

// ===== CHAT PAGE FUNCTIONALITY =====
function loadChatPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load chat content
  const chatContent = initializeChatPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = chatContent;
  }

  // Initialize chat functionality
  initializeChatFunctionality();

  showDashboardNotification("Chat loaded successfully!", "success");
}

function initializeChatPage() {
  return `
    <div class="chat-container">
      <header class="chat-header">
        <div>
          <h1>Study Stream Chat</h1>
          <p>Connect and collaborate with fellow students</p>
        </div>
        <div class="chat-actions">
          <button class="chat-action-btn" id="addFriend">
            <span>👤</span>
            Add Friend
          </button>
          <button class="chat-action-btn" id="createGroup">
            <span>👥</span>
            Create Group
          </button>
        </div>
      </header>

      <div class="chat-main">
        <!-- Friends Sidebar -->
        <div class="chat-sidebar">
          <div class="sidebar-section">
            <h3>Friends</h3>
            <div class="friends-list">
              <div class="friend-item online">
                <div class="friend-avatar">SW</div>
                <div class="friend-info">
                  <span class="friend-name">Sarah Wilson</span>
                  <span class="friend-status">Online - Mathematics</span>
                </div>
                <div class="friend-actions">
                  <button class="action-btn" title="Message">💬</button>
                  <button class="action-btn" title="Video Call">📹</button>
                </div>
              </div>

              <div class="friend-item online">
                <div class="friend-avatar">AC</div>
                <div class="friend-info">
                  <span class="friend-name">Alex Chen</span>
                  <span class="friend-status">Online - Programming</span>
                </div>
                <div class="friend-actions">
                  <button class="action-btn" title="Message">💬</button>
                  <button class="action-btn" title="Video Call">📹</button>
                </div>
              </div>

              <div class="friend-item away">
                <div class="friend-avatar">MR</div>
                <div class="friend-info">
                  <span class="friend-name">Maria Rodriguez</span>
                  <span class="friend-status">Away - Physics</span>
                </div>
                <div class="friend-actions">
                  <button class="action-btn" title="Message">💬</button>
                  <button class="action-btn" title="Video Call">📹</button>
                </div>
              </div>

              <div class="friend-item offline">
                <div class="friend-avatar">DJ</div>
                <div class="friend-info">
                  <span class="friend-name">David Johnson</span>
                  <span class="friend-status">Offline - Last seen 2h ago</span>
                </div>
                <div class="friend-actions">
                  <button class="action-btn" title="Message">💬</button>
                  <button class="action-btn" title="Video Call">📹</button>
                </div>
              </div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Study Groups</h3>
            <div class="groups-list">
              <div class="group-item active">
                <div class="group-icon">📚</div>
                <div class="group-info">
                  <span class="group-name">Mathematics Group</span>
                  <span class="group-members">8 members online</span>
                </div>
              </div>

              <div class="group-item">
                <div class="group-icon">💻</div>
                <div class="group-info">
                  <span class="group-name">Programming Hub</span>
                  <span class="group-members">12 members online</span>
                </div>
              </div>

              <div class="group-item">
                <div class="group-icon">🔬</div>
                <div class="group-info">
                  <span class="group-name">Physics Lab</span>
                  <span class="group-members">5 members online</span>
                </div>
              </div>

              <div class="group-item video-live">
                <div class="group-icon">🎥</div>
                <div class="group-info">
                  <span class="group-name">Chemistry Study</span>
                  <span class="group-members">Live Video - 4 members</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area">
          <div class="chat-header-active">
            <div class="active-chat-info">
              <div class="active-avatar">📚</div>
              <div>
                <h3>Mathematics Group</h3>
                <p>8 members online</p>
              </div>
            </div>
            <div class="chat-actions-active">
              <button class="chat-action" title="Video Call">📹 Start Video Call</button>
              <button class="chat-action" title="Members">👥 Members (8)</button>
              <button class="chat-action" title="Search">🔍</button>
            </div>
          </div>

          <div class="messages-container">
            <div class="message received">
              <div class="message-avatar">SW</div>
              <div class="message-content">
                <div class="message-sender">Sarah Wilson</div>
                <div class="message-text">Has anyone solved problem 3 from the calculus assignment?</div>
                <div class="message-time">10:15 AM</div>
              </div>
            </div>

            <div class="message received">
              <div class="message-avatar">AC</div>
              <div class="message-content">
                <div class="message-sender">Alex Chen</div>
                <div class="message-text">I'm stuck on that one too. The integration seems tricky.</div>
                <div class="message-time">10:17 AM</div>
              </div>
            </div>

            <div class="message sent">
              <div class="message-content">
                <div class="message-text">I think I figured it out! You need to use substitution with u = x² + 1</div>
                <div class="message-time">10:20 AM</div>
              </div>
            </div>

            <div class="message received">
              <div class="message-avatar">SW</div>
              <div class="message-content">
                <div class="message-sender">Sarah Wilson</div>
                <div class="message-text">Oh! That makes sense. Thanks for the help! 🙏</div>
                <div class="message-time">10:21 AM</div>
              </div>
            </div>

            <div class="message system">
              <div class="message-content">
                <div class="message-text">🎥 Maria Rodriguez started a video call</div>
                <button class="join-call-btn">Join Video Call</button>
              </div>
            </div>
          </div>

          <div class="message-input-container">
            <div class="input-actions">
              <button class="input-action" title="Attach">📎</button>
              <button class="input-action" title="Emoji">😊</button>
              <button class="input-action" title="Format">𝐀</button>
            </div>
            <input type="text" class="message-input" placeholder="Type a message...">
            <button class="send-btn">Send</button>
          </div>
        </div>
      </div>

      <!-- Online Members Sidebar -->
      <div class="members-sidebar">
        <h3>Online Members (8)</h3>
        <div class="members-list">
          <div class="member-item">
            <div class="member-avatar">SW</div>
            <div class="member-info">
              <span class="member-name">Sarah Wilson</span>
              <span class="member-status">Studying Calculus</span>
            </div>
          </div>
          <div class="member-item">
            <div class="member-avatar">AC</div>
            <div class="member-info">
              <span class="member-name">Alex Chen</span>
              <span class="member-status">Active now</span>
            </div>
          </div>
          <div class="member-item">
            <div class="member-avatar">MR</div>
            <div class="member-info">
              <span class="member-name">Maria Rodriguez</span>
              <span class="member-status">In a video call</span>
            </div>
          </div>
          <div class="member-item">
            <div class="member-avatar">KM</div>
            <div class="member-info">
              <span class="member-name">You</span>
              <span class="member-status">Online</span>
            </div>
          </div>
        </div>

        <div class="video-call-preview">
          <h4>Live Video Call</h4>
          <div class="video-thumbnail">
            <div class="video-placeholder">🎥</div>
            <span>Chemistry Study Group</span>
            <button class="join-video-btn">Join Call</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeChatFunctionality() {
  // Add friend functionality
  const addFriendBtn = document.getElementById("addFriend");
  if (addFriendBtn) {
    addFriendBtn.addEventListener("click", function () {
      const email = prompt("Enter your friend's StudyStream email:");
      if (email) {
        showDashboardNotification(`Friend request sent to ${email}`, "success");
      }
    });
  }

  // Create group functionality
  const createGroupBtn = document.getElementById("createGroup");
  if (createGroupBtn) {
    createGroupBtn.addEventListener("click", function () {
      const groupName = prompt("Enter group name:");
      if (groupName) {
        showDashboardNotification(
          `Group "${groupName}" created successfully!`,
          "success"
        );
      }
    });
  }

  // Message sending functionality
  const messageInput = document.querySelector(".message-input");
  const sendBtn = document.querySelector(".send-btn");
  const messagesContainer = document.querySelector(".messages-container");

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      const messageElement = document.createElement("div");
      messageElement.className = "message sent";
      messageElement.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message}</div>
          <div class="message-time">Just now</div>
        </div>
      `;
      messagesContainer.appendChild(messageElement);
      messageInput.value = "";

      // Auto scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Simulate reply after 2 seconds
      setTimeout(() => {
        const replyElement = document.createElement("div");
        replyElement.className = "message received";
        replyElement.innerHTML = `
          <div class="message-avatar">SW</div>
          <div class="message-content">
            <div class="message-sender">Sarah Wilson</div>
            <div class="message-text">Thanks for sharing! That's really helpful.</div>
            <div class="message-time">Just now</div>
          </div>
        `;
        messagesContainer.appendChild(replyElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 2000);
    }
  }

  if (sendBtn && messageInput) {
    sendBtn.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  // Video call functionality
  const videoCallBtns = document.querySelectorAll(
    '.action-btn[title="Video Call"]'
  );
  videoCallBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const friendItem = this.closest(".friend-item");
      const friendName = friendItem.querySelector(".friend-name").textContent;
      showDashboardNotification(
        `Starting video call with ${friendName}...`,
        "info"
      );
    });
  });

  // Join call buttons
  const joinCallBtns = document.querySelectorAll(
    ".join-call-btn, .join-video-btn"
  );
  joinCallBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      showDashboardNotification("Joining video call...", "info");
    });
  });
}

// ===== SETTINGS PAGE FUNCTIONALITY =====
function loadSettingsPage() {
  // HIDE the dashboard header
  const dashboardHeader = document.querySelector(".dashboard-header");
  if (dashboardHeader) dashboardHeader.style.display = "none";

  // Load settings content
  const settingsContent = initializeSettingsPage();
  const existingContent = document.querySelector(".dashboard-content");

  if (existingContent) {
    existingContent.innerHTML = settingsContent;
  }

  // Initialize settings functionality
  initializeSettingsFunctionality();

  showDashboardNotification("Settings loaded successfully!", "success");
}

function initializeSettingsPage() {
  const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return `
    <div class="settings-container">
      <header class="settings-header">
        <div>
          <h1>Account Settings</h1>
          <p>Manage your profile and preferences</p>
        </div>
        <div class="settings-actions">
          <button class="settings-action-btn" id="saveSettings">
            <span>💾</span>
            Save Changes
          </button>
        </div>
      </header>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Profile Information</h2>
          <div class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" value="${
                  userData.firstName || ""
                }" placeholder="Enter your first name">
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" value="${
                  userData.lastName || ""
                }" placeholder="Enter your last name">
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" value="${
                userData.email || ""
              }" placeholder="Enter your email address">
            </div>

            <div class="form-group">
              <label for="scholarLevel">Scholar Level</label>
              <select id="scholarLevel">
                <option value="Level 1 Scholar" ${
                  userData.scholarLevel === "Level 1 Scholar" ? "selected" : ""
                }>Level 1 Scholar</option>
                <option value="Level 2 Scholar" ${
                  userData.scholarLevel === "Level 2 Scholar" ? "selected" : ""
                }>Level 2 Scholar</option>
                <option value="Level 3 Scholar" ${
                  userData.scholarLevel === "Level 3 Scholar" ? "selected" : ""
                }>Level 3 Scholar</option>
                <option value="Level 4 Scholar" ${
                  userData.scholarLevel === "Level 4 Scholar" ? "selected" : ""
                }>Level 4 Scholar</option>
                <option value="Level 5 Scholar" ${
                  userData.scholarLevel === "Level 5 Scholar" ? "selected" : ""
                }>Level 5 Scholar</option>
              </select>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h2>Study Preferences</h2>
          <div class="preferences-grid">
            <div class="preference-item">
              <h4>Default Study Duration</h4>
              <select>
                <option>25 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
                <option>90 minutes</option>
              </select>
            </div>

            <div class="preference-item">
              <h4>Break Duration</h4>
              <select>
                <option>5 minutes</option>
                <option>10 minutes</option>
                <option>15 minutes</option>
                <option>20 minutes</option>
              </select>
            </div>

            <div class="preference-item">
              <h4>Study Reminders</h4>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="preference-item">
              <h4>Focus Mode</h4>
              <label class="switch">
                <input type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h2>Notification Settings</h2>
          <div class="notifications-grid">
            <div class="notification-item">
              <div class="notification-info">
                <h4>Study Room Invitations</h4>
                <p>Get notified when invited to study rooms</p>
              </div>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-info">
                <h4>Goal Achievements</h4>
                <p>Celebrate when you complete goals</p>
              </div>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-info">
                <h4>Challenge Updates</h4>
                <p>New challenges and progress updates</p>
              </div>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>

            <div class="notification-item">
              <div class="notification-info">
                <h4>Friend Messages</h4>
                <p>Notifications for new messages</p>
              </div>
              <label class="switch">
                <input type="checkbox" checked>
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h2>Account Management</h2>
          <div class="account-actions">
            <button class="account-btn secondary" id="changePassword">
              Change Password
            </button>
            <button class="account-btn secondary" id="exportData">
              Export Study Data
            </button>
            <button class="account-btn danger" id="deleteAccount">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function initializeSettingsFunctionality() {
  const saveBtn = document.getElementById("saveSettings");
  const changePasswordBtn = document.getElementById("changePassword");
  const exportDataBtn = document.getElementById("exportData");
  const deleteAccountBtn = document.getElementById("deleteAccount");

  // Save settings functionality
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const scholarLevel = document.getElementById("scholarLevel").value;

      // Get current user data
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const studyStreamUser = JSON.parse(
        localStorage.getItem("studyStreamUser") || "{}"
      );

      // Update user data
      const updatedUser = {
        ...currentUser,
        firstName: firstName,
        lastName: lastName,
        email: email,
        scholarLevel: scholarLevel,
      };

      const updatedStudyStreamUser = {
        ...studyStreamUser,
        firstName: firstName,
        lastName: lastName,
        email: email,
        scholarLevel: scholarLevel,
      };

      // Save to localStorage
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      localStorage.setItem(
        "studyStreamUser",
        JSON.stringify(updatedStudyStreamUser)
      );

      // Update dashboard in real-time
      updateUserInfo(updatedUser);

      showDashboardNotification("Settings saved successfully!", "success");
    });
  }

  // Change password functionality
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", function () {
      showDashboardNotification("Password change feature coming soon!", "info");
    });
  }

  // Export data functionality
  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", function () {
      const userData = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "studystream-data.json";
      link.click();

      URL.revokeObjectURL(url);
      showDashboardNotification("Study data exported successfully!", "success");
    });
  }

  // Delete account functionality
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", function () {
      if (
        confirm(
          "Are you sure you want to delete your account? This action cannot be undone."
        )
      ) {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("studyStreamUser");
        localStorage.removeItem("isLoggedIn");
        showDashboardNotification("Account deleted successfully!", "success");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    });
  }
}

function handleLogout() {
  // Show confirmation dialog
  if (confirm("Are you sure you want to log out?")) {
    // Clear authentication data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    // Show logout message
    showDashboardNotification("Logged out successfully!", "success");

    // Redirect to login page after a delay
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }
}

// ===== STUDY ROOMS FUNCTIONALITY =====
function initializeRoomActions() {
  const joinRoomBtns = document.querySelectorAll(".join-room-btn");
  const createRoomBtn = document.querySelector(".create-room-btn");
  const viewAllRoomsBtn = document.querySelector(".view-all-btn");

  // Join room functionality
  joinRoomBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const roomCard = this.closest(".room-card");
      const roomTitle = roomCard.querySelector(".room-title").textContent;
      joinStudyRoom(roomTitle);
    });
  });

  // Create room functionality
  if (createRoomBtn) {
    createRoomBtn.addEventListener("click", createStudyRoom);
  }

  // View all rooms functionality
  if (viewAllRoomsBtn) {
    viewAllRoomsBtn.addEventListener("click", viewAllRooms);
  }
}

function joinStudyRoom(roomName) {
  // Show loading state
  const buttons = document.querySelectorAll(".join-room-btn");
  buttons.forEach((btn) => {
    if (btn.textContent.includes("Join Room")) {
      btn.disabled = true;
      btn.innerHTML = '<span class="loading-spinner">⏳</span> Joining...';
    }
  });

  // Simulate API call
  setTimeout(() => {
    showDashboardNotification(`Joined ${roomName} successfully!`, "success");

    // Reset buttons
    buttons.forEach((btn) => {
      if (btn.innerHTML.includes("Joining...")) {
        btn.disabled = false;
        btn.textContent = "Join Room";
      }
    });

    // Update room participants (simulate)
    updateRoomParticipants(roomName);
  }, 2000);
}

function createStudyRoom() {
  const roomName = prompt("Enter study room name:");
  if (roomName) {
    showDashboardNotification(`Creating "${roomName}"...`, "info");

    // Simulate room creation
    setTimeout(() => {
      showDashboardNotification(
        `Study room "${roomName}" created successfully!`,
        "success"
      );
    }, 1500);
  }
}

function viewAllRooms() {
  showDashboardNotification("Loading all study rooms...", "info");
}

function updateRoomParticipants(roomName) {
  const roomCards = document.querySelectorAll(".room-card");
  roomCards.forEach((card) => {
    const title = card.querySelector(".room-title").textContent;
    if (title === roomName) {
      const participantCount = card.querySelector(".participant-count");
      const currentCount = parseInt(participantCount.textContent.split("/")[0]);
      const maxCount = parseInt(participantCount.textContent.split("/")[1]);

      if (currentCount < maxCount) {
        participantCount.textContent = `${
          currentCount + 1
        }/${maxCount} participants`;

        const userData = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );
        const avatarInitials = `${userData.firstName?.[0] || "U"}${
          userData.lastName?.[0] || "S"
        }`.toUpperCase();

        const avatarsContainer = card.querySelector(".participant-avatars");
        if (avatarsContainer.children.length < 4) {
          const newAvatar = document.createElement("div");
          newAvatar.className = "participant-avatar";
          newAvatar.textContent = avatarInitials;
          newAvatar.style.marginLeft = "-8px";
          avatarsContainer.appendChild(newAvatar);
        }
      }
    }
  });
}

// ===== QUICK ACTIONS FUNCTIONALITY =====
function initializeQuickActions() {
  const quickActionBtns = document.querySelectorAll(".action-btn");

  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const actionText = this.textContent.trim();
      handleQuickAction(actionText);
    });
  });
}

function handleQuickAction(action) {
  switch (action) {
    case "Start Pomodoro Session":
      startPomodoroTimer();
      break;
    case "Upload Study Materials":
      uploadStudyMaterials();
      break;
    case "Invite Study Buddy":
      inviteStudyBuddy();
      break;
    default:
      showDashboardNotification(`Action: ${action}`, "info");
  }
}

function startPomodoroTimer() {
  showDashboardNotification(
    "Starting Pomodoro Timer: 25 minutes of focused study!",
    "success"
  );
}

function uploadStudyMaterials() {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png";

  input.onchange = function (e) {
    const files = e.target.files;
    if (files.length > 0) {
      showDashboardNotification(`Uploading ${files.length} file(s)...`, "info");
      setTimeout(() => {
        showDashboardNotification(
          `Successfully uploaded ${files.length} file(s)!`,
          "success"
        );
      }, 2000);
    }
  };

  input.click();
}

function inviteStudyBuddy() {
  const email = prompt("Enter your study buddy's email:");
  if (email) {
    showDashboardNotification(`Invitation sent to ${email}!`, "success");
  }
}

// ===== USER PROFILE FUNCTIONALITY =====
function initializeUserProfile() {
  // User profile functionality can be added here
}

// ===== STATS FUNCTIONALITY =====
function initializeStats() {
  animateStats();
  setInterval(updateLiveStats, 30000);
}

function animateStats() {
  const statValues = document.querySelectorAll(".stat-value");

  statValues.forEach((stat) => {
    const targetValue = parseInt(stat.textContent);
    const isDecimal = stat.textContent.includes(".");

    if (!isNaN(targetValue)) {
      animateValue(stat, 0, targetValue, 2000);
    }
  });
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);

    if (element.textContent.includes(".")) {
      const currentValue = (progress * (end - start) + start).toFixed(1);
      element.textContent = currentValue;
    } else {
      const currentValue = Math.floor(progress * (end - start) + start);
      element.textContent = currentValue;
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function updateLiveStats() {
  const statCards = document.querySelectorAll(".stat-card");

  statCards.forEach((card) => {
    const statValue = card.querySelector(".stat-value");
    const subtitle = card.querySelector(".stat-subtitle").textContent;

    let currentValue = parseFloat(statValue.textContent);
    let newValue = currentValue;

    if (subtitle.includes("Study Streak")) {
      if (Math.random() > 0.7) newValue = currentValue + 1;
    } else if (subtitle.includes("Hours This Week")) {
      newValue = currentValue + Math.random() * 0.5;
    } else if (subtitle.includes("Study Sessions")) {
      if (Math.random() > 0.8) newValue = currentValue + 1;
    } else if (subtitle.includes("Achievements")) {
      if (Math.random() > 0.9) newValue = currentValue + 1;
    }

    if (newValue !== currentValue) {
      animateValue(statValue, currentValue, newValue, 1000);
    }
  });
}

// ===== SCHEDULE FUNCTIONALITY =====
function initializeSchedule() {
  updateScheduleTimes();
  setInterval(updateScheduleTimes, 60000);
}

function updateScheduleTimes() {
  const scheduleItems = document.querySelectorAll(".schedule-item");
  const now = new Date();

  scheduleItems.forEach((item) => {
    const timeElement = item.querySelector(".schedule-time");
    const timeText = timeElement.textContent;

    const [time, modifier] = timeText.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0, 0);

    const diffMs = scheduleTime - now;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 0) {
      item.style.opacity = "0.6";
      timeElement.innerHTML = "✅ Completed";
    } else if (diffMins <= 15) {
      item.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
      item.style.border = "1px solid rgba(34, 197, 94, 0.5)";
      timeElement.innerHTML = `⏰ Starting in ${diffMins}min`;
    } else if (diffMins <= 60) {
      timeElement.innerHTML = `🕒 In ${Math.floor(diffMins / 60)}h ${
        diffMins % 60
      }m`;
    }
  });
}

// ===== DASHBOARD NOTIFICATION SYSTEM =====
function showDashboardNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(
    ".dashboard-notification"
  );
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `dashboard-notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <button class="notification-close">&times;</button>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${
      type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"
    };
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => notification.remove(), 300);
  });

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);

  document.body.appendChild(notification);

  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== REAL-TIME UPDATES =====
function initializeRealTimeUpdates() {
  setInterval(updateRoomStatus, 15000);
}

function updateRoomStatus() {
  const roomCards = document.querySelectorAll(".room-card");

  roomCards.forEach((card) => {
    if (Math.random() > 0.7) {
      const participantCount = card.querySelector(".participant-count");
      const currentCount = parseInt(participantCount.textContent.split("/")[0]);
      const maxCount = parseInt(participantCount.textContent.split("/")[1]);

      if (currentCount < maxCount && Math.random() > 0.5) {
        participantCount.textContent = `${
          currentCount + 1
        }/${maxCount} participants`;
      } else if (currentCount > 2 && Math.random() > 0.8) {
        participantCount.textContent = `${
          currentCount - 1
        }/${maxCount} participants`;
      }
    }
  });
}
