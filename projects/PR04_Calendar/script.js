// Initialize calendar with current date
const currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let selectedDate = null;

// Indian Holidays Data (Fixed dates for 2023-2024)
const indianHolidays = {
    // Format: "month-day": {title, description}
    // National Holidays
    '1-26': { title: 'Republic Day', description: 'Celebration of the adoption of the Indian Constitution' },
    '8-15': { title: 'Independence Day', description: 'Celebration of Indian independence from British rule' },
    '10-2': { title: 'Gandhi Jayanti', description: 'Birth anniversary of Mahatma Gandhi' },
    
    // Religious & Cultural Holidays (2023-2024 approximate dates)
    '1-14': { title: 'Makar Sankranti', description: 'Harvest festival celebrated across India' },
    '1-22': { title: 'Vasant Panchami', description: 'Festival dedicated to Goddess Saraswati' },
    '3-8': { title: 'Holi', description: 'Festival of colors' },
    '4-6': { title: 'Ram Navami', description: 'Birthday of Lord Rama' },
    '4-14': { title: 'Ambedkar Jayanti', description: 'Birth anniversary of Dr. B.R. Ambedkar' },
    '6-29': { title: 'Eid al-Adha', description: 'Islamic festival of sacrifice' },
    '8-30': { title: 'Raksha Bandhan', description: 'Celebration of brother-sister bond' },
    '9-7': { title: 'Janmashtami', description: 'Birthday of Lord Krishna' },
    '9-17': { title: 'Ganesh Chaturthi', description: 'Festival celebrating Lord Ganesha' },
    '10-24': { title: 'Dussehra', description: 'Victory of good over evil' },
    '11-12': { title: 'Diwali', description: 'Festival of lights' },
    '11-13': { title: 'Govardhan Puja', description: 'Day after Diwali' },
    '11-14': { title: 'Bhai Dooj', description: 'Brother-sister festival after Diwali' },
    '12-25': { title: 'Christmas', description: 'Celebration of the birth of Jesus Christ' },
};

// Month names for display
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Days of the week
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Load events from localStorage or initialize empty object
let userEvents = JSON.parse(localStorage.getItem('calendarEvents')) || {};

// DOM elements
const calendarGrid = document.getElementById('calendar-grid');
const currentMonthYear = document.getElementById('current-month-year');
const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const dateModal = document.getElementById('date-modal');
const modalDate = document.getElementById('modal-date');
const modalEvents = document.getElementById('modal-events');
const eventForm = document.getElementById('event-form');
const closeModalBtn = document.getElementById('close-modal');
const cancelEventBtn = document.getElementById('cancel-event');

// Initialize the calendar
function initCalendar() {
    // Populate month and year dropdowns
    populateMonthDropdown();
    populateYearDropdown();
    
    // Set current month/year in dropdowns
    monthSelect.value = currentMonth;
    yearSelect.value = currentYear;
    
    // Generate the calendar
    generateCalendar();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize current month display
    updateCurrentMonthDisplay();
}

// Populate month dropdown
function populateMonthDropdown() {
    monthSelect.innerHTML = '';
    monthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
}

// Populate year dropdown (5 years back and 5 years forward)
function populateYearDropdown() {
    yearSelect.innerHTML = '';
    const startYear = currentDate.getFullYear() - 5;
    const endYear = currentDate.getFullYear() + 5;
    
    for (let year = startYear; year <= endYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Update current month display
function updateCurrentMonthDisplay() {
    currentMonthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Generate the calendar grid
function generateCalendar() {
    // Clear the calendar grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Update current month/year display
    updateCurrentMonthDisplay();
    
    // Get first day of the month and number of days in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // Check if this is today
        if (isCurrentMonth && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add events container
        const eventsContainer = document.createElement('div');
        eventsContainer.className = 'events-container';
        
        // Get date key for this day
        const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
        
        // Check for Indian holidays
        const holidayKey = `${currentMonth + 1}-${day}`;
        if (indianHolidays[holidayKey]) {
            const holidayEvent = document.createElement('div');
            holidayEvent.className = 'event holiday';
            holidayEvent.textContent = indianHolidays[holidayKey].title;
            holidayEvent.title = indianHolidays[holidayKey].description;
            eventsContainer.appendChild(holidayEvent);
        }
        
        // Check for user events
        if (userEvents[dateKey]) {
            userEvents[dateKey].forEach(event => {
                const userEvent = document.createElement('div');
                userEvent.className = 'event personal-event';
                userEvent.textContent = event.title;
                userEvent.title = event.description;
                eventsContainer.appendChild(userEvent);
            });
        }
        
        dayElement.appendChild(eventsContainer);
        
        // Add click event to open modal
        dayElement.addEventListener('click', () => openDateModal(day));
        
        calendarGrid.appendChild(dayElement);
    }
    
    // Calculate remaining empty cells to complete the grid
    const totalCells = 42; // 6 rows * 7 days
    const filledCells = firstDay + daysInMonth;
    const remainingCells = totalCells - filledCells;
    
    // Add empty cells for days after the last day of the month
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarGrid.appendChild(emptyDay);
    }
}

// Open modal with date details
function openDateModal(day) {
    selectedDate = new Date(currentYear, currentMonth, day);
    const dateString = selectedDate.toDateString();
    modalDate.textContent = dateString;
    
    // Clear previous events in modal
    modalEvents.innerHTML = '';
    
    // Get date key
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    const holidayKey = `${currentMonth + 1}-${day}`;
    
    // Check for Indian holidays
    if (indianHolidays[holidayKey]) {
        const holidayItem = document.createElement('div');
        holidayItem.className = 'event-item holiday';
        holidayItem.innerHTML = `
            <div class="event-title">${indianHolidays[holidayKey].title}</div>
            <div class="event-type">Indian Holiday</div>
            <p>${indianHolidays[holidayKey].description}</p>
        `;
        modalEvents.appendChild(holidayItem);
    }
    
    // Check for user events
    if (userEvents[dateKey] && userEvents[dateKey].length > 0) {
        userEvents[dateKey].forEach((event, index) => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item personal';
            eventItem.innerHTML = `
                <div class="event-title">${event.title}</div>
                <div class="event-type">Personal Event</div>
                <p>${event.description}</p>
                <button class="delete-event" data-date="${dateKey}" data-index="${index}" style="margin-top: 8px; background: #ef4444; color: white; border: none; padding: 4px 8px; cursor: pointer; font-size: 0.8rem;">Delete</button>
            `;
            modalEvents.appendChild(eventItem);
        });
    }
    
    // Show "no events" message if there are no events
    if (modalEvents.children.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.className = 'no-events';
        noEvents.textContent = 'No events scheduled for this date. Add one below!';
        modalEvents.appendChild(noEvents);
    }
    
    // Set the form date value
    document.getElementById('event-title').value = '';
    document.getElementById('event-description').value = '';
    
    // Show the modal
    dateModal.style.display = 'flex';
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-event').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const dateKey = this.getAttribute('data-date');
            const index = parseInt(this.getAttribute('data-index'));
            
            if (userEvents[dateKey]) {
                userEvents[dateKey].splice(index, 1);
                
                // If no events left for this date, remove the date key
                if (userEvents[dateKey].length === 0) {
                    delete userEvents[dateKey];
                }
                
                // Save to localStorage
                localStorage.setItem('calendarEvents', JSON.stringify(userEvents));
                
                // Refresh the calendar and modal
                generateCalendar();
                openDateModal(day);
            }
        });
    });
}

// Close modal
function closeModal() {
    dateModal.style.display = 'none';
    selectedDate = null;
}

// Add event to selected date
function addEvent(event) {
    event.preventDefault();
    
    if (!selectedDate) return;
    
    const title = document.getElementById('event-title').value.trim();
    const description = document.getElementById('event-description').value.trim();
    
    if (!title) {
        alert('Please enter an event title');
        return;
    }
    
    const day = selectedDate.getDate();
    const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
    
    // Initialize events array for this date if it doesn't exist
    if (!userEvents[dateKey]) {
        userEvents[dateKey] = [];
    }
    
    // Add the new event
    userEvents[dateKey].push({
        title,
        description,
        type: 'personal',
        added: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('calendarEvents', JSON.stringify(userEvents));
    
    // Refresh the calendar and modal
    generateCalendar();
    openDateModal(day);
    
    // Reset form
    event.target.reset();
}

// Set up event listeners
function setupEventListeners() {
    // Month and year dropdown changes
    monthSelect.addEventListener('change', () => {
        currentMonth = parseInt(monthSelect.value);
        generateCalendar();
    });
    
    yearSelect.addEventListener('change', () => {
        currentYear = parseInt(yearSelect.value);
        generateCalendar();
    });
    
    // Navigation buttons
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;
        generateCalendar();
    });
    
    document.getElementById('prev-year').addEventListener('click', () => {
        currentYear--;
        yearSelect.value = currentYear;
        generateCalendar();
    });
    
    document.getElementById('next-year').addEventListener('click', () => {
        currentYear++;
        yearSelect.value = currentYear;
        generateCalendar();
    });
    
    // Modal controls
    closeModalBtn.addEventListener('click', closeModal);
    cancelEventBtn.addEventListener('click', () => {
        document.getElementById('event-form').reset();
closeModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === dateModal) {
            closeModal();
        }
    });
    
    // Event form submission
    eventForm.addEventListener('submit', addEvent);
}

// Initialize the calendar when page loads
document.addEventListener('DOMContentLoaded', initCalendar);