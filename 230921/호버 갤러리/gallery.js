const data = [
    { title: '노르웨이숲', url: 'image/1.jpg' },
    { title: '치즈', url: 'image/2.jpg' },
    { title: '렉돌', url: 'image/3.jpg' },
    { title: '페르시안', url: 'image/4.jpg' },
    { title: '먼치킨', url: 'image/5.jpg' },
]

//1. list에 목록
const list = document.getElementById('list')
console.log(list);

for (let i = 0; i < data.length; i++) {
    //반복해서 li요소에 title 값을 담아줌
    list.innerHTML += `<li class="button">${data[i].title} </li>`
}

//.button 클래스를 가진 요소들을 모두 가져옴
const buttons = document.querySelectorAll('.button')
const image = document.getElementById('image')
const title = document.getElementById('title')

for (let i = 0; i < buttons.length; i++) {
    console.log(buttons[i])
    //i번째 버튼을 클릭하면, 
    buttons[i].addEventListener('click', () => {
        //i번째 data의 url을 콘솔로 출력
        console.log(data[i].url)
        //이미지 태그의 src 속성에 data[i].url 값 할당
        image.src = data[i].url
        //title의 값에 data[i].title
        title.textContent-data[i].title
    })
}