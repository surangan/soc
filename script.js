const filters = document.querySelectorAll('.filter');
const ideaCards = document.querySelectorAll('.idea-card');

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    filters.forEach(f => f.classList.remove('active'));
    filter.classList.add('active');
    const selected = filter.dataset.filter;

    ideaCards.forEach(card => {
      const category = card.dataset.category;
      const visible = selected === 'all' || category === selected || category === 'all';
      card.classList.toggle('hidden', !visible);
    });
  });
});

document.querySelectorAll('.copy-button').forEach(button => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copy);
    const text = target.innerText;
    let copied = false;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      const writeFromCopyEvent = event => {
        event.clipboardData.setData('text/plain', text);
        event.preventDefault();
      };
      document.addEventListener('copy', writeFromCopyEvent);
      copied = document.execCommand('copy');
      document.removeEventListener('copy', writeFromCopyEvent);
    }

    if (!copied) {
      const fallback = document.createElement('textarea');
      fallback.value = text;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.left = '-9999px';
      document.body.appendChild(fallback);
      fallback.focus();
      fallback.select();
      fallback.setSelectionRange(0, fallback.value.length);
      copied = document.execCommand('copy');
      fallback.remove();
    }

    const old = button.innerText;
    button.innerText = copied ? 'Copied' : 'Select text';
    setTimeout(() => button.innerText = old, 1400);
  });
});

let selectedMinutes = Number(document.querySelector('.mode-button.active')?.dataset.minutes) || 55;
let remainingSeconds = selectedMinutes * 60;
let timerId = null;

const display = document.getElementById('timerDisplay');
const message = document.getElementById('timerMessage');
const modeButtons = document.querySelectorAll('.mode-button');

function renderTimer() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  display.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  if (remainingSeconds <= 300 && remainingSeconds > 0) {
    message.textContent = 'Five-minute warning: finish the demo path and publish your link.';
  } else if (remainingSeconds === 0) {
    message.textContent = 'Time. Submit the link and prepare to share.';
  }
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

modeButtons.forEach(button => {
  button.addEventListener('click', () => {
    stopTimer();
    modeButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    selectedMinutes = Number(button.dataset.minutes);
    remainingSeconds = selectedMinutes * 60;
    message.textContent = 'Ready when you are.';
    renderTimer();
  });
});

document.getElementById('startTimer').addEventListener('click', () => {
  if (timerId || remainingSeconds === 0) return;
  message.textContent = 'Build sprint in progress.';
  timerId = setInterval(() => {
    remainingSeconds -= 1;
    renderTimer();
    if (remainingSeconds <= 0) stopTimer();
  }, 1000);
});

document.getElementById('pauseTimer').addEventListener('click', () => {
  stopTimer();
  message.textContent = 'Timer paused.';
});

document.getElementById('resetTimer').addEventListener('click', () => {
  stopTimer();
  remainingSeconds = selectedMinutes * 60;
  message.textContent = 'Ready when you are.';
  renderTimer();
});

renderTimer();

const projectForm = document.getElementById('projectForm');
const projectGallery = document.getElementById('projectGallery');
const voteResults = document.getElementById('voteResults');
const voteStatus = document.getElementById('voteStatus');
const clearProjects = document.getElementById('clearProjects');
const projectsStorageKey = 'faculty-ai-build-projects';
const voteStorageKey = 'faculty-ai-build-vote';

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(projectsStorageKey)) || [];
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(projectsStorageKey, JSON.stringify(projects));
}

function getStoredVote() {
  return localStorage.getItem(voteStorageKey);
}

function placeholderImage(title) {
  const safeTitle = title.replace(/[&<>]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  }[character]));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">
      <rect width="960" height="600" fill="#eaf0f7"/>
      <rect x="54" y="54" width="852" height="492" rx="24" fill="#ffffff" stroke="#003d7c" stroke-opacity=".25"/>
      <text x="90" y="170" fill="#ef7c00" font-family="Arial, sans-serif" font-size="34" font-weight="700">NUS Computing</text>
      <text x="90" y="270" fill="#003d7c" font-family="Arial, sans-serif" font-size="68" font-weight="700">${safeTitle}</text>
      <text x="90" y="350" fill="#52677d" font-family="Arial, sans-serif" font-size="30">Project preview</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function renderVoteResults(projects) {
  if (!voteResults) return;
  voteResults.innerHTML = '';

  if (!projects.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No project votes yet.';
    voteResults.appendChild(empty);
    return;
  }

  const maxVotes = Math.max(...projects.map(project => project.votes), 1);
  [...projects]
    .sort((a, b) => b.votes - a.votes || a.title.localeCompare(b.title))
    .forEach(project => {
      const result = document.createElement('div');
      result.className = 'vote-result';

      const top = document.createElement('div');
      top.className = 'vote-result-top';

      const title = document.createElement('span');
      title.textContent = project.title;

      const count = document.createElement('span');
      count.textContent = `${project.votes} vote${project.votes === 1 ? '' : 's'}`;

      const bar = document.createElement('div');
      bar.className = 'vote-bar';

      const fill = document.createElement('span');
      fill.style.width = `${Math.max(6, (project.votes / maxVotes) * 100)}%`;

      top.append(title, count);
      bar.appendChild(fill);
      result.append(top, bar);
      voteResults.appendChild(result);
    });
}

function renderProjects() {
  if (!projectGallery) return;

  const projects = loadProjects();
  const storedVote = getStoredVote();
  projectGallery.innerHTML = '';

  if (voteStatus) {
    voteStatus.textContent = storedVote
      ? 'Your vote has been recorded in this browser.'
      : 'Add projects, then vote for the one you want to see continue. Voting is limited to one vote per browser on this static page.';
  }

  if (!projects.length) {
    const empty = document.createElement('div');
    empty.className = 'project-empty';
    empty.textContent = 'No projects yet. Add the first team prototype above.';
    projectGallery.appendChild(empty);
    renderVoteResults(projects);
    return;
  }

  projects.forEach(project => {
    const card = document.createElement('article');
    card.className = 'project-card';

    const imageLink = document.createElement('a');
    imageLink.className = 'project-image-link';
    imageLink.href = project.url;
    imageLink.target = '_blank';
    imageLink.rel = 'noopener noreferrer';
    imageLink.title = `Open ${project.title}`;

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = `${project.title} project preview`;
    image.loading = 'lazy';
    imageLink.appendChild(image);

    const body = document.createElement('div');
    body.className = 'project-card-body';

    const meta = document.createElement('span');
    meta.className = 'project-meta';
    meta.textContent = project.team;

    const title = document.createElement('h3');
    title.textContent = project.title;

    const pitch = document.createElement('p');
    pitch.textContent = project.pitch || 'Prototype submitted for the Faculty AI Build Challenge.';

    const actions = document.createElement('div');
    actions.className = 'project-card-actions';

    const voteCount = document.createElement('span');
    voteCount.className = 'vote-count';
    voteCount.textContent = `${project.votes} vote${project.votes === 1 ? '' : 's'}`;

    const voteButton = document.createElement('button');
    voteButton.className = 'button button-secondary vote-button';
    voteButton.type = 'button';
    voteButton.dataset.projectId = project.id;
    voteButton.textContent = storedVote === project.id ? 'Voted' : 'Vote';
    voteButton.disabled = Boolean(storedVote);

    actions.append(voteCount, voteButton);
    body.append(meta, title, pitch, actions);
    card.append(imageLink, body);
    projectGallery.appendChild(card);
  });

  renderVoteResults(projects);
}

if (projectForm) {
  projectForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(projectForm);
    const team = String(data.get('teamName') || '').trim();
    const title = String(data.get('projectTitle') || '').trim();
    const url = String(data.get('projectUrl') || '').trim();
    const imageUrl = String(data.get('imageUrl') || '').trim();
    const pitch = String(data.get('projectPitch') || '').trim();
    const file = data.get('projectImage');

    if (!team || !title || !url) return;

    let image = imageUrl || placeholderImage(title);
    if (file && file.size) {
      image = await readImageFile(file);
    }

    const projects = loadProjects();
    projects.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      team,
      title,
      url,
      image,
      pitch,
      votes: 0
    });

    try {
      saveProjects(projects);
      projectForm.reset();
      renderProjects();
    } catch {
      if (voteStatus) {
        voteStatus.textContent = 'This browser could not save the project image. Try a smaller image or use an image URL.';
      }
    }
  });
}

if (projectGallery) {
  projectGallery.addEventListener('click', event => {
    const voteButton = event.target.closest('.vote-button');
    if (!voteButton || getStoredVote()) return;

    const projects = loadProjects();
    const project = projects.find(item => item.id === voteButton.dataset.projectId);
    if (!project) return;

    project.votes += 1;
    saveProjects(projects);
    localStorage.setItem(voteStorageKey, project.id);
    renderProjects();
  });
}

if (clearProjects) {
  clearProjects.addEventListener('click', () => {
    if (!confirm('Reset the project gallery and votes saved in this browser?')) return;
    localStorage.removeItem(projectsStorageKey);
    localStorage.removeItem(voteStorageKey);
    renderProjects();
  });
}

renderProjects();
