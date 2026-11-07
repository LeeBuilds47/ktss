(function () {
  const ADMISSION_KEY = 'admission_applications';
  const CONTACT_KEY = 'contact_messages';

  const defaultAdmissions = [
    {
      id: 'KTSS-1001',
      firstName: 'Aline',
      lastName: 'Uwimana',
      program: 'software',
      phone: '+250788112233',
      email: 'aline.uwimana@example.com',
      status: 'pending',
      createdAt: '2026-11-04T08:15:00.000Z'
    },
    {
      id: 'KTSS-1002',
      firstName: 'Ian',
      lastName: 'Kamanzi',
      program: 'olevel',
      phone: '+250783445566',
      email: 'ian.kamanzi@example.com',
      status: 'review',
      createdAt: '2026-11-03T14:45:00.000Z'
    },
    {
      id: 'KTSS-1003',
      firstName: 'Mireille',
      lastName: 'Ntakirutimana',
      program: 'accounting',
      phone: '+250726334455',
      email: 'mireille.ntaki@example.com',
      status: 'approved',
      createdAt: '2026-11-02T10:30:00.000Z'
    }
  ];

  const defaultMessages = [
    {
      id: 'MSG-5001',
      name: 'Darius Nkurunziza',
      email: 'darius@example.com',
      message: 'Hello team, I would like to know whether the software development program still has open seats for next intake.',
      status: 'unread',
      createdAt: '2026-11-05T09:30:00.000Z'
    },
    {
      id: 'MSG-5002',
      name: 'Mugisha Emmanuel',
      email: 'mugisha@example.com',
      message: 'Could you send me the fee breakdown for the O\'Level track and admission requirements? Thanks.',
      status: 'read',
      createdAt: '2026-11-04T16:10:00.000Z'
    },
    {
      id: 'MSG-5003',
      name: 'Aisha Uwase',
      email: 'aisha@example.com',
      message: 'Our daughter is interested in the accounting program. Please share the next available visit date.',
      status: 'unread',
      createdAt: '2026-11-04T07:25:00.000Z'
    }
  ];

  const $ = (selector, context = document) => context.querySelector(selector);

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function mergeRecords(primary, fallback) {
    const map = new Map();
    [...fallback, ...primary].forEach((entry) => {
      if (!entry || !entry.id) return;
      if (!map.has(entry.id)) map.set(entry.id, entry);
    });
    return [...map.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  function programLabel(value) {
    const map = {
      software: 'Software Development',
      olevel: "O'Level",
      accounting: 'Accounting'
    };
    return map[value] || value || 'Unassigned';
  }

  function statusClass(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'pending') return 'status-pending';
    if (normalized === 'approved' || normalized === 'accepted') return 'status-approved';
    if (normalized === 'rejected' || normalized === 'declined') return 'status-rejected';
    return 'status-review';
  }

  function statusText(status) {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'approved' || normalized === 'accepted') return 'Approved';
    if (normalized === 'rejected' || normalized === 'declined') return 'Rejected';
    if (normalized === 'review') return 'In review';
    return 'Pending';
  }

  function updateMetricCounts(admissions, messages) {
    const pendingBadge = $('#pending-count');
    const unreadBadge = $('#unread-count');

    if (pendingBadge) {
      pendingBadge.textContent = String(admissions.filter((item) => {
        const status = String(item.status || '').toLowerCase();
        return status === 'pending' || status === 'review';
      }).length);
    }

    if (unreadBadge) {
      unreadBadge.textContent = String(messages.filter((item) => String(item.status || '').toLowerCase() === 'unread').length);
    }
  }

  function renderQueue() {
    const admissions = mergeRecords(readStorage(ADMISSION_KEY, []), defaultAdmissions);
    const tableBody = $('#admission-queue-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (!admissions.length) {
      tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No applications found.</td></tr>';
      updateMetricCounts(admissions, mergeRecords(readStorage(CONTACT_KEY, []), defaultMessages));
      return;
    }

    admissions.forEach((item) => {
      const row = document.createElement('tr');

      const studentCell = document.createElement('td');
      studentCell.innerHTML = `
        <span class="student-name">${(item.firstName || 'Student')} ${(item.lastName || '')}</span>
        <span class="student-meta">${item.email || item.phone || 'No contact info'}</span>
      `;

      const programCell = document.createElement('td');
      programCell.textContent = programLabel(item.program);

      const submittedCell = document.createElement('td');
      submittedCell.textContent = formatDate(item.createdAt);

      const statusCell = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = `status-badge--compact ${statusClass(item.status)}`;
      badge.textContent = statusText(item.status);
      statusCell.appendChild(badge);

      const actionsCell = document.createElement('td');
      const actions = document.createElement('div');
      actions.className = 'row-actions';

      const approveBtn = document.createElement('button');
      approveBtn.type = 'button';
      approveBtn.className = 'inline-btn primary';
      approveBtn.textContent = 'Approve';
      approveBtn.addEventListener('click', () => updateAdmissionStatus(item.id, 'approved'));

      const rejectBtn = document.createElement('button');
      rejectBtn.type = 'button';
      rejectBtn.className = 'inline-btn danger';
      rejectBtn.textContent = 'Reject';
      rejectBtn.addEventListener('click', () => updateAdmissionStatus(item.id, 'rejected'));

      actions.append(approveBtn, rejectBtn);
      actionsCell.appendChild(actions);

      row.append(studentCell, programCell, submittedCell, statusCell, actionsCell);
      tableBody.appendChild(row);
    });

    updateMetricCounts(admissions, mergeRecords(readStorage(CONTACT_KEY, []), defaultMessages));
  }

  function renderMessages() {
    const messages = mergeRecords(readStorage(CONTACT_KEY, []), defaultMessages);
    const container = $('#contact-ledger');
    if (!container) return;
    container.innerHTML = '';

    if (!messages.length) {
      container.innerHTML = '<div class="message-item"><p class="message-body">No messages yet.</p></div>';
      updateMetricCounts(mergeRecords(readStorage(ADMISSION_KEY, []), defaultAdmissions), messages);
      return;
    }

    messages.forEach((message) => {
      const item = document.createElement('article');
      item.className = `message-item ${String(message.status || '').toLowerCase() === 'unread' ? 'unread' : ''}`;

      const header = document.createElement('div');
      header.className = 'message-header';

      const sender = document.createElement('span');
      sender.className = 'message-sender';
      sender.textContent = message.name || 'New contact';

      const time = document.createElement('span');
      time.className = 'message-time';
      time.textContent = formatDate(message.createdAt);

      header.append(sender, time);

      const subject = document.createElement('p');
      subject.className = 'message-subject';
      subject.textContent = message.email || 'No email provided';

      const body = document.createElement('p');
      body.className = 'message-body';
      body.textContent = message.message || 'No message content.';

      const actions = document.createElement('div');
      actions.className = 'message-actions';
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = String(message.status || '').toLowerCase() === 'unread' ? 'Mark as Read' : 'Read';
      button.addEventListener('click', () => updateMessageStatus(message.id, 'read'));
      actions.appendChild(button);

      item.append(header, subject, body, actions);
      container.appendChild(item);
    });

    updateMetricCounts(mergeRecords(readStorage(ADMISSION_KEY, []), defaultAdmissions), messages);
  }

  function updateAdmissionStatus(id, nextStatus) {
    const existing = readStorage(ADMISSION_KEY, []);
    const merged = mergeRecords(existing, defaultAdmissions);
    const target = merged.find((entry) => entry.id === id);
    if (!target) return;

    target.status = nextStatus;
    const next = existing.some((entry) => entry.id === id)
      ? existing.map((entry) => (entry.id === id ? target : entry))
      : [target, ...existing];

    writeStorage(ADMISSION_KEY, next);
    renderQueue();
  }

  function updateMessageStatus(id, nextStatus) {
    const existing = readStorage(CONTACT_KEY, []);
    const merged = mergeRecords(existing, defaultMessages);
    const target = merged.find((entry) => entry.id === id);
    if (!target) return;

    target.status = nextStatus;
    const next = existing.some((entry) => entry.id === id)
      ? existing.map((entry) => (entry.id === id ? target : entry))
      : [target, ...existing];

    writeStorage(CONTACT_KEY, next);
    renderMessages();
  }

  function seedDemoData() {
    writeStorage(ADMISSION_KEY, defaultAdmissions);
    writeStorage(CONTACT_KEY, defaultMessages);
    renderQueue();
    renderMessages();
  }

  function init() {
    const refreshButton = $('#refresh-dashboard');
    const seedButton = $('#seed-sample-data');

    if (refreshButton) {
      refreshButton.addEventListener('click', () => {
        renderQueue();
        renderMessages();
      });
    }

    if (seedButton) {
      seedButton.addEventListener('click', seedDemoData);
    }

    if (!localStorage.getItem(ADMISSION_KEY)) {
      writeStorage(ADMISSION_KEY, defaultAdmissions);
    }

    if (!localStorage.getItem(CONTACT_KEY)) {
      writeStorage(CONTACT_KEY, defaultMessages);
    }

    renderQueue();
    renderMessages();
  }

  init();
})();
