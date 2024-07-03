document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let audioFiles = [];
    let currentTrackIndex = 0;
    const maxFiles = 10;

    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);
        const newFiles = files.slice(0, maxFiles - audioFiles.length);
        audioFiles = audioFiles.concat(newFiles);

        if (audioFiles.length > maxFiles) {
            audioFiles = audioFiles.slice(0, maxFiles);
        }

        displayFileList();
    });

    function displayFileList() {
        fileList.innerHTML = '';
        audioFiles.forEach((file, index) => {
            const listItem = document.createElement('div');
            listItem.className = 'file-item';

            const fileName = document.createElement('span');
            fileName.textContent = `${index + 1}. ${file.name}`;
            fileName.addEventListener('click', () => {
                playTrack(index);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '&times;';
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                removeTrack(index);
            });

            listItem.appendChild(fileName);
            listItem.appendChild(deleteButton);
            fileList.appendChild(listItem);
        });
    }

    function playTrack(index) {
        if (index >= 0 && index < audioFiles.length) {
            currentTrackIndex = index;
            const url = URL.createObjectURL(audioFiles[index]);
            audioPlayer.src = url;
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        }
    }

    function removeTrack(index) {
        audioFiles.splice(index, 1);
        if (currentTrackIndex >= index) {
            currentTrackIndex = Math.max(0, currentTrackIndex - 1);
        }
        displayFileList();
        if (audioFiles.length === 0) {
            audioPlayer.pause();
            audioPlayer.src = '';
            playPauseButton.textContent = 'Play';
        } else {
            playTrack(currentTrackIndex);
        }
    }

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            playTrack(currentTrackIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentTrackIndex < audioFiles.length - 1) {
            playTrack(currentTrackIndex + 1);
        } else {
            playTrack(0); // Go back to the first track
        }
    });

    audioPlayer.addEventListener('ended', () => {
        if (currentTrackIndex < audioFiles.length - 1) {
            playTrack(currentTrackIndex + 1);
        } else {
            playTrack(0); // Go back to the first track
        }
    });
});
