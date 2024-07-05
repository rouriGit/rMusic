document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.getElementById('playPauseButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    let audioFiles = [];
    let currentTrackIndex = 0;
    const maxFiles = 20;

    // Fetch MP3 files from rFolder directory
    fetchMp3Files();

    function fetchMp3Files() {
        // Simulating fetching from rFolder (replace with actual server-side fetching logic if applicable)
        const rFolderFiles = [
            'Love Song-Uru.mp3', 
            'We Found Love-Rihanna.mp3', 
            'Dragon Night.mp3', 
            'Stick Figure.mp3', 
            'Wasted Nights.mp3', 
            '太陽は見上げる人を選ばない.mp3', 
            '泣き地蔵.mp3', 
            '置き手紙.mp3', 
            '蝶々結び.mp3', 
            '裸の勇者.mp3',
            'High Land.mp3',
            'Ghost.mp3',
            'HANABI.mp3'
        ]; // List of files in rFolder
        audioFiles = rFolderFiles.map(file => ({
            name: file,
            url: `./rFolder/${file}`
        }));
        displayFileList();
    }

    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);
        const newFiles = files.slice(0, maxFiles - audioFiles.length);
        audioFiles = audioFiles.concat(newFiles.map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        })));

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

            const dragHandle = document.createElement('span');
            dragHandle.textContent = '︙';
            dragHandle.className = 'drag-handle';

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

            listItem.appendChild(dragHandle);
            listItem.appendChild(fileName);
            listItem.appendChild(deleteButton);
            fileList.appendChild(listItem);
        });

        new Sortable(fileList, {
            handle: '.drag-handle',
            animation: 150,
            onEnd: function (evt) {
                const [movedItem] = audioFiles.splice(evt.oldIndex, 1);
                audioFiles.splice(evt.newIndex, 0, movedItem);
                displayFileList();
            }
        });
    }

    function playTrack(index) {
        if (index >= 0 && index < audioFiles.length) {
            currentTrackIndex = index;
            const url = audioFiles[index].url;
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
