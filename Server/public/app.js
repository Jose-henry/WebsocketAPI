const socket = io('ws://localhost:3000');
const commentInput = document.querySelector('#comment');
const commentList =  document.querySelector('.comment-display');

function sendComment(e) {
    e.preventDefault();
    if(commentInput.value) {
        socket.emit('message', commentInput.value);
        commentInput.value = '';
    }
    commentInput.focus();
}

document.querySelector('.form-comment')
        .addEventListener('submit', sendComment);

socket.on('message', (data) => {
    const li = document.createElement('li');
    li.textContent = data;
    document.querySelector('ul').appendChild(li);
});

