document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image');

    images.forEach(image => {
        image.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);

            // 모든 내용을 숨기고
            document.querySelectorAll('.content').forEach(content => {
                content.classList.add('hidden');
            });

            // 선택한 내용만 보여주기
            targetContent.classList.remove('hidden');
        });
    });
});