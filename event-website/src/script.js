document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const categoryFilter = document.getElementById('category-filter');
  let talks = [];

  // Fetch talk data
  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      populateCategories(talks);
      renderSchedule(talks);
    });

  // Populate category filter
  function populateCategories(talks) {
    const categories = new Set();
    talks.forEach(talk => {
      talk.category.forEach(cat => categories.add(cat));
    });
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  }

  // Render schedule
  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date('2026-01-01T10:00:00');

    talksToRender.forEach((talk, index) => {
      if (index === 3) {
        // Lunch break
        const lunchBreak = document.createElement('div');
        lunchBreak.className = 'schedule-item lunch';
        const lunchTime = new Date(currentTime.getTime());
        lunchBreak.innerHTML = `
          <div class="time">${formatTime(lunchTime)} - ${formatTime(new Date(lunchTime.getTime() + 60 * 60 * 1000))}</div>
          <h2>Lunch Break</h2>
        `;
        scheduleContainer.appendChild(lunchBreak);
        currentTime.setMinutes(currentTime.getMinutes() + 60);
      }
      
      const talkElement = document.createElement('div');
      talkElement.className = 'schedule-item';

      const talkTime = new Date(currentTime.getTime());
      const endTime = new Date(talkTime.getTime() + talk.duration * 60 * 1000);

      talkElement.innerHTML = `
        <div class="time">${formatTime(talkTime)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">By: ${talk.speakers.join(', ')}</div>
        <div class="categories">
          ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
        </div>
        <p>${talk.description}</p>
      `;

      scheduleContainer.appendChild(talkElement);

      currentTime = new Date(endTime.getTime() + 10 * 60 * 1000); // 10 minute break
    });
  }

  // Format time
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Filter event listener
  categoryFilter.addEventListener('change', () => {
    const selectedCategory = categoryFilter.value;
    if (selectedCategory === 'all') {
      renderSchedule(talks);
    } else {
      const filteredTalks = talks.filter(talk => talk.category.includes(selectedCategory));
      renderSchedule(filteredTalks);
    }
  });
});
