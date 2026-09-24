let events = [];
let editingEventIndex = null;
function updateLocationOptions(value) {
    const locationContainer = document.getElementById('location_container');
    const remoteContainer = document.getElementById('remote_container');
    const locationInput = document.getElementById("event_location");
    const remoteInput = document.getElementById("event_remote_url");
    if (value === 'in-person') {
        locationContainer.style.display = 'block';
        remoteContainer.style.display = 'none';
        locationInput.required = true;
        remoteInput.required = false;
    } else if (value === 'remote') {
        locationContainer.style.display = 'none';
        remoteContainer.style.display = 'block';
        locationInput.required = false;
        remoteInput.required = true;
    } else {
    locationContainer.style.display = 'none';
    remoteContainer.style.display = 'none';
    locationInput.required = false;
    remoteInput.required = false;
}
}
function saveEvent() {
    const form = document.getElementById('event_form');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
const name = document.getElementById('event_name').value;
const weekday = document.getElementById('event_weekday').value;
const time = document.getElementById('event_time').value;
const modality = document.getElementById('event_modality').value;
const location = modality === 'in-person'
    ? document.getElementById('event_location').value
    : null;

const remote_url = modality === 'remote'
    ? document.getElementById('event_remote_url').value
    : null;
    const attendees = document.getElementById('event_attendees').value;
    const category = document.getElementById('event_category').value;
    const eventDetails = {
    name: name,
    weekday: weekday,
    time: time,
    modality: modality,
    location: location,
    remote_url: remote_url,
    attendees: attendees,
    category: category
    
};
if (editingEventIndex === null) {
    events.push(eventDetails);
} else {
    events[editingEventIndex] = eventDetails;
    editingEventIndex = null;
}

refreshCalendar();
console.log(events);

form.reset();

const modalElement = document.getElementById('event_modal');
const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
modal.hide();
}
function createEventCard(eventDetails) {
const eventElement = document.createElement('div');
eventElement.className = 'event row border rounded m-1 py-1';
eventElement.addEventListener('click', function () {
    const index = events.indexOf(eventDetails);
    editEvent(index);
});
if (eventDetails.category === 'academic') {
    eventElement.classList.add('bg-primary', 'text-white');
} else if (eventDetails.category === 'work') {
    eventElement.style.backgroundColor = 'pink';
    eventElement.classList.add('text-dark');
} else if (eventDetails.category === 'personal') {
    eventElement.style.backgroundColor = 'mediumpurple';
    eventElement.classList.add('text-white');
} else if (eventDetails.category === 'social') {
    eventElement.classList.add('bg-info', 'text-dark');
}

const eventContent = document.createElement('div');

eventContent.innerHTML = `
    <strong>${eventDetails.name}</strong><br>
    ${eventDetails.time}<br>
    ${eventDetails.modality}<br>
    ${eventDetails.category}<br>
`;

if (eventDetails.modality === 'in-person') {
    eventContent.innerHTML += `Location: ${eventDetails.location}<br>`;
} else {
    eventContent.innerHTML += `URL: ${eventDetails.remote_url}<br>`;
}
eventContent.innerHTML += `Attendees: ${eventDetails.attendees}`;

eventElement.appendChild(eventContent);

return eventElement;
}
function editEvent(index) {
    editingEventIndex = index;
    const event = events[index];

    document.getElementById('event_name').value = event.name;
    document.getElementById('event_weekday').value = event.weekday;
    document.getElementById('event_time').value = event.time;
    document.getElementById('event_modality').value = event.modality;
    document.getElementById('event_attendees').value = event.attendees;
    document.getElementById('event_category').value = event.category;

    updateLocationOptions(event.modality);

    if (event.modality === 'in-person') {
        document.getElementById('event_location').value = event.location;
    } else if (event.modality === 'remote') {
        document.getElementById('event_remote_url').value = event.remote_url;
    }

    const modalElement = document.getElementById('event_modal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}
function addEventToCalendarUI(eventInfo) {
    const day = document.getElementById(eventInfo.weekday);
    const eventCard = createEventCard(eventInfo);
day.appendChild(eventCard);
}
function refreshCalendar() {
    const eventCards = document.querySelectorAll('.event');
    eventCards.forEach(card => card.remove());

    events.forEach(event => {
        addEventToCalendarUI(event);
    });
}

