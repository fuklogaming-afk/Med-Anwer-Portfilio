import './index.css';

/**
 * Med Anwr Personal Portfolio - TypeScript Controller
 * Features:
 * - Interactive Neon Cyan Vortex / Spirograph Canvas (from inspiration)
 * - Dedicated Screen Panel (Split-Viewer for About, Projects, Skills, Certificates, Contact)
 * - Dynamic Projects with (+) Add Project button
 * - Skills Manager with Real-Time Search Filter & Custom Tags
 * - Certificates section (zero fake certificates, (+) Add PDF, expand on click)
 * - Real photo of Med Anwr with zero filters
 * - Direct Email copy & Mobile navigation
 */

interface SkillItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  roleBadge: string;
  tags: string[];
  level: number;
}

interface ProjectItem {
  id: string;
  num: string;
  title: string;
  category: string;
  desc: string;
  url: string;
  tags: string[];
}

interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  pdfUrl: string;
  fileName: string;
}

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. NEON CYAN VORTEX & PARTICLE MESH CANVAS (From inspiration reference)
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('vortexCanvas') as HTMLCanvasElement | null;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let angle = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      mouseX = width * 0.7;
      mouseY = height * 0.45;
      targetMouseX = mouseX;
      targetMouseY = mouseY;
    }

    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    });

    function drawVortex() {
      if (!ctx || width === 0 || height === 0) return;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const centerX = width > 900 ? width * 0.68 : width * 0.5;
      const centerY = height > 700 ? height * 0.48 : height * 0.45;

      angle += 0.003;

      const rings = 48;
      const pointsPerRing = 70;

      ctx.lineWidth = 1;

      for (let r = 1; r <= rings; r++) {
        const radius = r * (Math.min(width, height) / 80) * 1.6;
        const ringAlpha = Math.max(0.04, 0.42 - (r / rings) * 0.35);

        ctx.beginPath();
        const isAccentRing = r % 8 === 0;
        ctx.strokeStyle = isAccentRing
          ? `rgba(0, 245, 212, ${ringAlpha * 1.8})`
          : `rgba(20, 184, 166, ${ringAlpha})`;

        for (let p = 0; p <= pointsPerRing; p++) {
          const theta = (p / pointsPerRing) * Math.PI * 2;
          const twist = angle + (r * 0.07);
          const wave = Math.sin(theta * 3 + twist) * (r * 1.8);
          const x = centerX + Math.cos(theta + twist) * (radius + wave);
          const y = centerY + Math.sin(theta + twist) * (radius * 0.65 + wave);

          if (p === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        if (r % 5 === 0) {
          const dotTheta = angle * 2 + r;
          const dotX = centerX + Math.cos(dotTheta) * (radius * 0.9);
          const dotY = centerY + Math.sin(dotTheta) * (radius * 0.65);
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#00f5d4';
          ctx.shadowColor = '#00f5d4';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      requestAnimationFrame(drawVortex);
    }

    drawVortex();
  }

  // Helper escape function
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 2. PROJECTS STATE & (+) ADD PROJECT CONTROLLER
  // --------------------------------------------------------------------------
  const initialProjects: ProjectItem[] = [
    {
      id: 'proj-bistronova',
      num: 'PROJECT // 01',
      title: 'bistronova siteweb',
      category: 'Restaurant Web Experience',
      desc: 'A dedicated modern website created for bistronova, showcasing digital culinary presentation, responsive layout, and clean user experience.',
      url: 'https://bistronova.web',
      tags: ['html', 'css', 'js', 'Responsive Design']
    }
  ];

  let projects: ProjectItem[] = [...initialProjects];

  const projectsContainerMain = document.getElementById('projectsContainerMain') as HTMLElement | null;
  const projectsContainerPanel = document.getElementById('projectsContainerPanel') as HTMLElement | null;

  function renderProjects() {
    const html = projects.map((p, idx) => `
      <article class="project-item-card" data-project-id="${p.id}">
        <div class="project-side-graphic">
          <span class="project-num-badge">PROJECT // ${String(idx + 1).padStart(2, '0')}</span>
          <div class="project-terminal-window">
            <div class="terminal-dots-row">
              <span class="t-dot"></span>
              <span class="t-dot"></span>
              <span class="t-dot"></span>
            </div>
            <div class="t-code">${escapeHtml(p.url || 'https://project.local')}</div>
          </div>
          <div class="project-side-tag">${escapeHtml(p.category)}</div>
        </div>

        <div class="project-body-content">
          <span class="project-category">${escapeHtml(p.category)}</span>
          <h3 class="project-headline">${escapeHtml(p.title)}</h3>
          <p class="project-desc-text">
            ${escapeHtml(p.desc)}
          </p>
          <div class="tech-pills-row">
            ${p.tags.map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    if (projectsContainerMain) projectsContainerMain.innerHTML = html;
    if (projectsContainerPanel) projectsContainerPanel.innerHTML = html;
  }

  renderProjects();

  // (+) Add Project Modal
  const addProjectModal = document.getElementById('addProjectModal') as HTMLElement | null;
  const triggerAddProjectBtnMain = document.getElementById('triggerAddProjectBtnMain') as HTMLButtonElement | null;
  const triggerAddProjectBtnPanel = document.getElementById('triggerAddProjectBtnPanel') as HTMLButtonElement | null;
  const closeAddProjectModalBtn = document.getElementById('closeAddProjectModalBtn') as HTMLButtonElement | null;
  const cancelAddProjectBtn = document.getElementById('cancelAddProjectBtn') as HTMLButtonElement | null;
  const addProjectForm = document.getElementById('addProjectForm') as HTMLFormElement | null;

  function openAddProjectModal() {
    if (!addProjectModal) return;
    if (addProjectForm) addProjectForm.reset();
    addProjectModal.classList.add('open');
  }

  function closeAddProjectModal() {
    if (addProjectModal) addProjectModal.classList.remove('open');
  }

  if (triggerAddProjectBtnMain) triggerAddProjectBtnMain.addEventListener('click', openAddProjectModal);
  if (triggerAddProjectBtnPanel) triggerAddProjectBtnPanel.addEventListener('click', openAddProjectModal);
  if (closeAddProjectModalBtn) closeAddProjectModalBtn.addEventListener('click', closeAddProjectModal);
  if (cancelAddProjectBtn) cancelAddProjectBtn.addEventListener('click', closeAddProjectModal);

  if (addProjectModal) {
    addProjectModal.addEventListener('click', (e) => {
      if (e.target === addProjectModal) closeAddProjectModal();
    });
  }

  if (addProjectForm) {
    addProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('projectNameInput') as HTMLInputElement | null;
      const categoryInput = document.getElementById('projectCategoryInput') as HTMLInputElement | null;
      const descInput = document.getElementById('projectDescInput') as HTMLTextAreaElement | null;
      const urlInput = document.getElementById('projectUrlInput') as HTMLInputElement | null;
      const tagsInput = document.getElementById('projectTagsInput') as HTMLInputElement | null;

      const title = nameInput?.value.trim() || 'New Project';
      const category = categoryInput?.value.trim() || 'Web Project';
      const desc = descInput?.value.trim() || 'Project developed by Med Anwr.';
      const url = urlInput?.value.trim() || 'https://github.com/fuklogaming-afk';
      const rawTags = tagsInput?.value.trim() || 'html, css, js';

      const tags = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const newProject: ProjectItem = {
        id: `proj-${Date.now()}`,
        num: `PROJECT // ${String(projects.length + 1).padStart(2, '0')}`,
        title,
        category,
        desc,
        url,
        tags: tags.length > 0 ? tags : ['Web', 'Code']
      };

      projects.unshift(newProject);
      renderProjects();
      closeAddProjectModal();
      showToast(`Project "${title}" added successfully!`);
    });
  }

  // --------------------------------------------------------------------------
  // 3. SKILLS STATE, REAL-TIME SEARCH FILTER & (+) ADD SKILL MODAL
  // --------------------------------------------------------------------------
  const initialSkills: SkillItem[] = [
    {
      id: 'skill-html',
      name: 'HTML5',
      icon: '</>',
      category: 'Semantic Web & Accessibility',
      roleBadge: 'Markup & DOM',
      tags: ['#SemanticHTML5', '#DOMStructure', '#Accessibility', '#WebStandards', '#SEO'],
      level: 95
    },
    {
      id: 'skill-css',
      name: 'CSS3',
      icon: '#_',
      category: 'Responsive & Cyber Aesthetics',
      roleBadge: 'Styling Engine',
      tags: ['#Flexbox&Grid', '#ResponsiveDesign', '#CSSVariables', '#KeyframesAnimation', '#Glassmorphism'],
      level: 90
    },
    {
      id: 'skill-js',
      name: 'JavaScript',
      icon: 'JS',
      category: 'Modern ES6+ & Interactive UI',
      roleBadge: 'Client Logic',
      tags: ['#ES6+Syntax', '#DOMManipulation', '#Async/Await', '#EventArchitecture', '#FetchAPI'],
      level: 88
    },
    {
      id: 'skill-c',
      name: 'C Language',
      icon: '_C_',
      category: 'Systems & Memory Management',
      roleBadge: 'Low-Level Core',
      tags: ['#Pointers&Memory', '#DataStructures', '#Algorithms', '#FileI/O', '#SystemsLogic'],
      level: 82
    },
    {
      id: 'skill-java',
      name: 'Java',
      icon: '☕',
      category: 'Object-Oriented & Enterprise Systems',
      roleBadge: 'OOP Architecture',
      tags: ['#OOPDesign', '#CollectionsFramework', '#Polymorphism', '#JVMRuntime', '#CleanCode'],
      level: 85
    },
    {
      id: 'skill-php',
      name: 'PHP',
      icon: '<?',
      category: 'Server Scripting & Database Integration',
      roleBadge: 'Backend Engine',
      tags: ['#ServerScripting', '#MySQLIntegration', '#SessionAuth', '#RESTfulEndpoints', '#FormHandling'],
      level: 82
    }
  ];

  let skills: SkillItem[] = [...initialSkills];
  let currentSearchQuery = '';

  const skillsMatrixMain = document.getElementById('skillsMatrixMain') as HTMLElement | null;
  const skillsMatrixPanel = document.getElementById('skillsMatrixPanel') as HTMLElement | null;
  const skillNavCount = document.getElementById('skillNavCount') as HTMLElement | null;
  const skillSearchInput = document.getElementById('skillSearchInput') as HTMLInputElement | null;
  const skillSearchClearBtn = document.getElementById('skillSearchClearBtn') as HTMLButtonElement | null;
  const skillSearchCountBadge = document.getElementById('skillSearchCountBadge') as HTMLElement | null;

  function renderSkills() {
    const query = currentSearchQuery.trim().toLowerCase();
    const filtered = skills.filter(skill => {
      if (!query) return true;
      const matchName = skill.name.toLowerCase().includes(query);
      const matchCat = skill.category.toLowerCase().includes(query);
      const matchBadge = skill.roleBadge.toLowerCase().includes(query);
      const matchTags = skill.tags.some(t => t.toLowerCase().includes(query));
      return matchName || matchCat || matchBadge || matchTags;
    });

    // Update count badge
    if (skillSearchCountBadge) {
      if (query) {
        skillSearchCountBadge.textContent = `Showing ${filtered.length} of ${skills.length} skills`;
      } else {
        skillSearchCountBadge.textContent = `Showing ${skills.length} of ${skills.length} skills`;
      }
    }

    if (skillNavCount) {
      skillNavCount.textContent = String(skills.length);
    }

    let contentHtml = '';

    if (filtered.length === 0) {
      contentHtml = `
        <div class="skills-empty-state">
          <div class="skills-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h4 class="skills-empty-title">No matching skills found</h4>
          <p class="skills-empty-desc">
            No skill matches "<strong>${escapeHtml(query)}</strong>". Try searching for another technology or tag.
          </p>
          <div class="skills-empty-actions">
            <button type="button" class="btn-cyber-outline" id="resetSkillSearchBtn">
              <span>Reset Search</span>
            </button>
            <button type="button" class="btn-cyber-primary" id="addSkillFromSearchBtn">
              <span>+ Add "${escapeHtml(query)}" As Skill</span>
            </button>
          </div>
        </div>
      `;
    } else {
      contentHtml = filtered.map(skill => `
        <div class="skill-matrix-card">
          <div class="skill-card-top">
            <div class="skill-icon-display">${escapeHtml(skill.icon)}</div>
            <span class="skill-role-badge">${escapeHtml(skill.roleBadge)}</span>
          </div>
          <div class="skill-card-main">
            <h3 class="skill-card-title">${escapeHtml(skill.name)}</h3>
            <div class="skill-card-category">${escapeHtml(skill.category)}</div>
            <div class="skill-tags-cloud">
              ${skill.tags.map(t => `<span class="skill-tag-chip">${escapeHtml(t.startsWith('#') ? t : '#' + t)}</span>`).join('')}
            </div>
          </div>
          <div class="skill-bar-meter">
            <div class="skill-bar-fill" style="width: ${skill.level}%;"></div>
          </div>
        </div>
      `).join('');
    }

    if (skillsMatrixMain) skillsMatrixMain.innerHTML = contentHtml;
    if (skillsMatrixPanel) skillsMatrixPanel.innerHTML = contentHtml;

    // Attach empty-state button handlers if rendered
    const resetBtn = document.getElementById('resetSkillSearchBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (skillSearchInput) {
          skillSearchInput.value = '';
          currentSearchQuery = '';
          if (skillSearchClearBtn) skillSearchClearBtn.style.display = 'none';
          renderSkills();
          skillSearchInput.focus();
        }
      });
    }

    const addFromSearchBtn = document.getElementById('addSkillFromSearchBtn');
    if (addFromSearchBtn) {
      addFromSearchBtn.addEventListener('click', () => {
        openAddSkillModal(query);
      });
    }
  }

  // Real-time search input listener
  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', () => {
      currentSearchQuery = skillSearchInput.value;
      if (skillSearchClearBtn) {
        skillSearchClearBtn.style.display = currentSearchQuery.length > 0 ? 'flex' : 'none';
      }
      renderSkills();
    });
  }

  if (skillSearchClearBtn) {
    skillSearchClearBtn.addEventListener('click', () => {
      if (skillSearchInput) {
        skillSearchInput.value = '';
        currentSearchQuery = '';
        skillSearchClearBtn.style.display = 'none';
        renderSkills();
        skillSearchInput.focus();
      }
    });
  }

  // Initial skills render
  renderSkills();

  // (+) Add Skill Modal
  const addSkillModal = document.getElementById('addSkillModal') as HTMLElement | null;
  const triggerAddSkillMain = document.getElementById('triggerAddSkillBtnMain') as HTMLButtonElement | null;
  const triggerAddSkillPanel = document.getElementById('triggerAddSkillBtnPanel') as HTMLButtonElement | null;
  const closeAddSkillModalBtn = document.getElementById('closeAddSkillModalBtn') as HTMLButtonElement | null;
  const cancelAddSkillBtn = document.getElementById('cancelAddSkillBtn') as HTMLButtonElement | null;
  const addSkillForm = document.getElementById('addSkillForm') as HTMLFormElement | null;
  const skillLevelInput = document.getElementById('skillLevelInput') as HTMLInputElement | null;
  const skillLevelValueText = document.getElementById('skillLevelValueText') as HTMLElement | null;

  function openAddSkillModal(prefillName?: string) {
    if (!addSkillModal) return;
    if (addSkillForm) addSkillForm.reset();
    if (skillLevelValueText) skillLevelValueText.textContent = '85%';
    if (prefillName) {
      const nameInput = document.getElementById('skillNameInput') as HTMLInputElement | null;
      if (nameInput) nameInput.value = prefillName;
    }
    addSkillModal.classList.add('open');
  }

  function closeAddSkillModal() {
    if (addSkillModal) addSkillModal.classList.remove('open');
  }

  if (triggerAddSkillMain) triggerAddSkillMain.addEventListener('click', () => openAddSkillModal());
  if (triggerAddSkillPanel) triggerAddSkillPanel.addEventListener('click', () => openAddSkillModal());
  if (closeAddSkillModalBtn) closeAddSkillModalBtn.addEventListener('click', closeAddSkillModal);
  if (cancelAddSkillBtn) cancelAddSkillBtn.addEventListener('click', closeAddSkillModal);

  if (addSkillModal) {
    addSkillModal.addEventListener('click', (e) => {
      if (e.target === addSkillModal) closeAddSkillModal();
    });
  }

  if (skillLevelInput && skillLevelValueText) {
    skillLevelInput.addEventListener('input', () => {
      skillLevelValueText.textContent = `${skillLevelInput.value}%`;
    });
  }

  if (addSkillForm) {
    addSkillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('skillNameInput') as HTMLInputElement | null;
      const categoryInput = document.getElementById('skillCategoryInput') as HTMLInputElement | null;
      const roleBadgeInput = document.getElementById('skillRoleBadgeInput') as HTMLInputElement | null;
      const tagsInput = document.getElementById('skillTagsInput') as HTMLInputElement | null;

      const name = nameInput?.value.trim() || 'New Technology';
      const category = categoryInput?.value.trim() || 'Software Engineering';
      const roleBadge = roleBadgeInput?.value.trim() || 'Engineering';
      const rawTags = tagsInput?.value.trim() || '#Skill';
      const level = skillLevelInput ? parseInt(skillLevelInput.value, 10) : 85;

      const parsedTags = rawTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`);

      const newSkill: SkillItem = {
        id: `skill-${Date.now()}`,
        name,
        icon: name.length > 3 ? name.substring(0, 2).toUpperCase() : name.toUpperCase(),
        category,
        roleBadge,
        tags: parsedTags.length > 0 ? parsedTags : [`#${name}`],
        level
      };

      skills.unshift(newSkill);
      renderSkills();
      closeAddSkillModal();
      showToast(`Skill "${name}" added to portfolio!`);
    });
  }

  // --------------------------------------------------------------------------
  // 4. CERTIFICATES STATE & (+) ADD PDF CERTIFICATE (NO FAKE CERTIFICATIONS)
  // --------------------------------------------------------------------------
  // User explicitly instructed: "without any fake certification and add the (+) add pdf to make me add certifica in the future"
  let certificates: CertificateItem[] = [];

  const certsGridMain = document.getElementById('certsGridMain') as HTMLElement | null;
  const certsGridPanel = document.getElementById('certsGridPanel') as HTMLElement | null;
  const certNavCount = document.getElementById('certNavCount') as HTMLElement | null;

  function renderCertificates() {
    if (certNavCount) {
      certNavCount.textContent = String(certificates.length);
    }

    let html = '';

    if (certificates.length === 0) {
      html = `
        <div class="certs-empty-state">
          <div class="certs-empty-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="6"></circle>
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
            </svg>
          </div>
          <h4 class="certs-empty-title">No Certificates Uploaded Yet</h4>
          <p class="certs-empty-desc">
            Med Anwr has not uploaded any certificates yet. Use the <strong>(+) Add Certificate (PDF)</strong> button to upload and showcase your official academic and engineering certificates.
          </p>
          <div class="certs-empty-actions">
            <button type="button" class="btn-cyber-primary" id="emptyStateAddCertBtn">
              <span style="font-weight: 900; font-size: 1.1rem; line-height: 1;">+</span>
              <span>Upload Certificate (PDF)</span>
            </button>
          </div>
        </div>
      `;
    } else {
      // Small certificate cards that get bigger on click ("make the certifica small and get bigger onclick")
      html = certificates.map(cert => `
        <div class="cert-card-small" data-cert-id="${cert.id}" role="button" tabindex="0" title="Click to enlarge certificate">
          <div class="cert-small-header">
            <div class="cert-badge-emblem">PDF</div>
            <span class="cert-format-badge">OFFICIAL</span>
          </div>
          <div>
            <div class="cert-small-issuer">${escapeHtml(cert.issuer)}</div>
            <h3 class="cert-small-title">${escapeHtml(cert.title)}</h3>
          </div>
          <div class="cert-small-footer">
            <span class="cert-date">${escapeHtml(cert.date)}</span>
            <span class="cert-expand-hint">
              <span>Enlarge</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </span>
          </div>
        </div>
      `).join('');
    }

    if (certsGridMain) certsGridMain.innerHTML = html;
    if (certsGridPanel) certsGridPanel.innerHTML = html;

    // Attach click events on empty state trigger
    const emptyBtn = document.getElementById('emptyStateAddCertBtn');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', openAddCertModal);
    }

    // Attach click events to make certificates "get bigger onclick"
    document.querySelectorAll<HTMLElement>('.cert-card-small').forEach(card => {
      card.addEventListener('click', () => {
        const certId = card.getAttribute('data-cert-id');
        const found = certificates.find(c => c.id === certId);
        if (found) {
          openExpandedCertModal(found);
        }
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const certId = card.getAttribute('data-cert-id');
          const found = certificates.find(c => c.id === certId);
          if (found) {
            openExpandedCertModal(found);
          }
        }
      });
    });
  }

  // Initial certificates render (starts with 0 certificates as requested)
  renderCertificates();

  // Expanded Certificate Modal ("make the certifica small and get bigger onclick")
  const expandedCertModal = document.getElementById('expandedCertModal') as HTMLElement | null;
  const expandedCertHeading = document.getElementById('expandedCertHeading') as HTMLElement | null;
  const expandedCertIssuer = document.getElementById('expandedCertIssuer') as HTMLElement | null;
  const expandedCertDate = document.getElementById('expandedCertDate') as HTMLElement | null;
  const expandedCertDownloadBtn = document.getElementById('expandedCertDownloadBtn') as HTMLAnchorElement | null;
  const closeExpandedCertModalBtn = document.getElementById('closeExpandedCertModalBtn') as HTMLButtonElement | null;
  const closeExpandedCertActionBtn = document.getElementById('closeExpandedCertActionBtn') as HTMLButtonElement | null;

  function openExpandedCertModal(cert: CertificateItem) {
    if (!expandedCertModal) return;
    if (expandedCertHeading) expandedCertHeading.textContent = cert.title;
    if (expandedCertIssuer) expandedCertIssuer.textContent = cert.issuer;
    if (expandedCertDate) expandedCertDate.textContent = cert.date;
    if (expandedCertDownloadBtn) {
      expandedCertDownloadBtn.href = cert.pdfUrl;
      expandedCertDownloadBtn.download = cert.fileName || `${cert.title}.pdf`;
    }
    expandedCertModal.classList.add('open');
  }

  function closeExpandedCertModal() {
    if (expandedCertModal) expandedCertModal.classList.remove('open');
  }

  if (closeExpandedCertModalBtn) closeExpandedCertModalBtn.addEventListener('click', closeExpandedCertModal);
  if (closeExpandedCertActionBtn) closeExpandedCertActionBtn.addEventListener('click', closeExpandedCertModal);
  if (expandedCertModal) {
    expandedCertModal.addEventListener('click', (e) => {
      if (e.target === expandedCertModal) closeExpandedCertModal();
    });
  }

  // (+) Add Certificate Modal
  const addCertModal = document.getElementById('addCertModal') as HTMLElement | null;
  const triggerAddCertBtnMain = document.getElementById('triggerAddCertBtnMain') as HTMLButtonElement | null;
  const triggerAddCertBtnPanel = document.getElementById('triggerAddCertBtnPanel') as HTMLButtonElement | null;
  const closeAddCertModalBtn = document.getElementById('closeAddCertModalBtn') as HTMLButtonElement | null;
  const cancelAddCertBtn = document.getElementById('cancelAddCertBtn') as HTMLButtonElement | null;
  const addCertForm = document.getElementById('addCertForm') as HTMLFormElement | null;
  const certPdfFileInput = document.getElementById('certPdfFileInput') as HTMLInputElement | null;
  const fileChosenPreview = document.getElementById('fileChosenPreview') as HTMLElement | null;
  const chosenFileNameText = document.getElementById('chosenFileNameText') as HTMLElement | null;

  let currentSelectedPdfFile: File | null = null;
  let currentSelectedPdfUrl: string | null = null;

  function openAddCertModal() {
    if (!addCertModal) return;
    if (addCertForm) addCertForm.reset();
    currentSelectedPdfFile = null;
    currentSelectedPdfUrl = null;
    if (fileChosenPreview) fileChosenPreview.classList.remove('visible');
    addCertModal.classList.add('open');
  }

  function closeAddCertModal() {
    if (addCertModal) addCertModal.classList.remove('open');
  }

  if (triggerAddCertBtnMain) triggerAddCertBtnMain.addEventListener('click', openAddCertModal);
  if (triggerAddCertBtnPanel) triggerAddCertBtnPanel.addEventListener('click', openAddCertModal);
  if (closeAddCertModalBtn) closeAddCertModalBtn.addEventListener('click', closeAddCertModal);
  if (cancelAddCertBtn) cancelAddCertBtn.addEventListener('click', closeAddCertModal);

  if (addCertModal) {
    addCertModal.addEventListener('click', (e) => {
      if (e.target === addCertModal) closeAddCertModal();
    });
  }

  // Handle PDF file selection
  if (certPdfFileInput) {
    certPdfFileInput.addEventListener('change', () => {
      if (certPdfFileInput.files && certPdfFileInput.files.length > 0) {
        const file = certPdfFileInput.files[0];
        currentSelectedPdfFile = file;
        currentSelectedPdfUrl = URL.createObjectURL(file);
        if (chosenFileNameText) chosenFileNameText.textContent = file.name;
        if (fileChosenPreview) fileChosenPreview.classList.add('visible');
      }
    });
  }

  // Handle Certificate Form Submission
  if (addCertForm) {
    addCertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('certTitleInput') as HTMLInputElement | null;
      const issuerInput = document.getElementById('certIssuerInput') as HTMLInputElement | null;
      const dateInput = document.getElementById('certDateInput') as HTMLInputElement | null;

      const title = titleInput?.value.trim() || 'Certificate of Excellence';
      const issuer = issuerInput?.value.trim() || 'EPI Engineering';
      const date = dateInput?.value.trim() || '2026';

      const fileName = currentSelectedPdfFile ? currentSelectedPdfFile.name : `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
      const pdfUrl = currentSelectedPdfUrl || '#';

      const newCert: CertificateItem = {
        id: `cert-${Date.now()}`,
        title,
        issuer,
        date,
        pdfUrl,
        fileName
      };

      certificates.unshift(newCert);
      renderCertificates();
      closeAddCertModal();
      showToast(`Certificate "${title}" added! Click card to enlarge.`);
    });
  }

  // --------------------------------------------------------------------------
  // 5. DEDICATED SCREEN PANEL CONTROLLER (Split-Viewer for non-Home pages)
  // --------------------------------------------------------------------------
  const screenPanel = document.getElementById('dedicatedScreenPanel') as HTMLElement | null;
  const panelBackdrop = document.getElementById('screenPanelBackdrop') as HTMLElement | null;
  const closePanelBtn = document.getElementById('closePanelBtn') as HTMLButtonElement | null;
  const panelCurrentTitle = document.getElementById('panelCurrentTitle') as HTMLElement | null;
  const panelTabs = document.querySelectorAll<HTMLButtonElement>('.panel-tab-btn');
  const panelViews = document.querySelectorAll<HTMLElement>('.panel-page-view');
  const panelTriggers = document.querySelectorAll<HTMLElement>('.nav-panel-trigger');
  
  const mobileMenuBtn = document.getElementById('mobileMenuBtn') as HTMLButtonElement | null;
  const navLinks = document.getElementById('navLinks') as HTMLUListElement | null;
  const header = document.querySelector<HTMLElement>('.site-header');

  const PAGE_TITLES: Record<string, string> = {
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    certificates: 'Certificates',
    contact: 'Contact'
  };

  function openScreenPanel(pageKey: string) {
    if (!screenPanel || !panelBackdrop) return;
    screenPanel.classList.add('open');
    panelBackdrop.classList.add('active');
    document.body.style.overflow = window.innerWidth <= 768 ? 'hidden' : '';
    switchPanelView(pageKey);

    if (navLinks && mobileMenuBtn) {
      navLinks.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  function closeScreenPanel() {
    if (!screenPanel || !panelBackdrop) return;
    screenPanel.classList.remove('open');
    panelBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchPanelView(pageKey: string) {
    const key = pageKey.toLowerCase();
    if (panelCurrentTitle) {
      panelCurrentTitle.textContent = PAGE_TITLES[key] || 'Workspace';
    }

    panelTabs.forEach(tab => {
      const tabTarget = tab.getAttribute('data-panel-tab');
      if (tabTarget === key) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    panelViews.forEach(view => {
      const viewId = view.getAttribute('id');
      if (viewId === `panelView-${key}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });
  }

  panelTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = trigger.getAttribute('data-target-page') || 'about';
      openScreenPanel(targetPage);
    });
  });

  panelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPage = tab.getAttribute('data-panel-tab') || 'about';
      switchPanelView(targetPage);
    });
  });

  if (closePanelBtn) closePanelBtn.addEventListener('click', closeScreenPanel);
  if (panelBackdrop) panelBackdrop.addEventListener('click', closeScreenPanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeScreenPanel();
      closeAddSkillModal();
      closeAddProjectModal();
      closeAddCertModal();
      closeExpandedCertModal();
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('open');
    });
  }

  // --------------------------------------------------------------------------
  // 6. TOAST NOTIFICATION & CLIPBOARD
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toastNotification') as HTMLDivElement | null;
  const EMAIL_ADDRESS = 'Fuklogaming@gmail.com';

  function showToast(message: string): void {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function setupCopyButton(btnId: string) {
    const btn = document.getElementById(btnId) as HTMLButtonElement | null;
    if (!btn) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(EMAIL_ADDRESS);
        showToast('Email copied: ' + EMAIL_ADDRESS);
      } catch {
        const temp = document.createElement('input');
        temp.value = EMAIL_ADDRESS;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Email copied: ' + EMAIL_ADDRESS);
      }
    });
  }

  setupCopyButton('copyEmailBtn');
  setupCopyButton('copyEmailPanelBtn');

  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  const backToTopBtn = document.getElementById('backToTopBtn') as HTMLAnchorElement | null;
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeScreenPanel();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
