'use strict';

const pathParts = window.location.pathname.split('/');
const roomId = pathParts[pathParts.length - 1];
const statusEl = document.getElementById('waitingStatus');
const loginLink = document.getElementById('loginLink');
const pollInterval = 5000;

// Set login link with room param so host returns to the room after login
if (roomId && roomId !== 'join') {
    loginLink.href = '/login?room=' + encodeURIComponent(roomId);
}

function checkRoom() {
    if (!roomId || roomId === 'join') return;

    axios
        .post('/isRoomActive', { roomId: roomId })
        .then(function (response) {
            if (response.data && response.data.message === true) {
                statusEl.textContent = 'Room is ready! Joining...';
                statusEl.classList.add('ready');
                setTimeout(function () {
                    window.location.href = '/join/' + encodeURIComponent(roomId);
                }, 800);
            } else {
                statusEl.textContent = 'Waiting for host to start the meeting...';
                setTimeout(checkRoom, pollInterval);
            }
        })
        .catch(function () {
            statusEl.textContent = 'Waiting for host to start the meeting...';
            setTimeout(checkRoom, pollInterval);
        });
}

checkRoom();
