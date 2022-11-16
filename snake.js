let scoreBlock; //отображение на странице очков
let score = 0; //очки
let recordArr = [];//массив где храниться рекорд
//настройки игры
const config = {
    step: 0, //для пропуска игрового цикла
    maxStep: 6,  //для пропуска игрового цикла
    sizeCell: 20, //размер одной ячейки 
    sizeBarry: 20 / 4 //размер ягоды
}

//все что связано с змейкой
const snake = {
    x: 160, //координаты по x
    y: 160, //координаты по y
    dx: config.sizeCell, //скорость по горизонтали
    dy: 0, //скорость по вертикали
    tails: [], // массив ячеек под контролем нашей змейки
    maxTails: 3, //количество ячеек

}

//координаты ягоды
let berry = {
    x: 0,
    y: 0
}


//popap начала игры
let popap = document.querySelector('.popap');
let btnPopap = document.querySelector('.popap__btn');

btnPopap.addEventListener('click', function start(){
    popap.style.display = 'none';
    requestAnimationFrame(gameLoop);
});

//popap game over
let popapOver = document.querySelector('.popap__over');
let btnReturn = document.querySelector('.popap__return');

btnReturn.addEventListener('click', function(){
    popapOver.style.display = 'none';
    start();
});


//пролучить canvas
let canvas = document.querySelector('#game-canvas');
let context = canvas.getContext('2d');

//поле для отображение очков
scoreBlock = document.querySelector('.game-score .score-count');
drawScore();


function gameLoop(){

    requestAnimationFrame(gameLoop);//gameLoop будет вызываться бесконечно
    if(++config.step < config.maxStep){//далее проверка если step < maxStep то мы пробускаем дальнейшую работу функции
        return;
    }
    config.step = 0;


    context.clearRect(0, 0, canvas.width, canvas.height);//каждый кадр отчищать 

    //и занава прорисовать ягоду и змейку
    drawBerry();
    drawSnake();
}



//отобразим змеку
function drawSnake(){
    //отобразим змеку согласно скорости
    snake.x += snake.dx;
    snake.y += snake.dy;

    collisionBorder();

    //todo бордер 
    snake.tails.unshift({ x:snake.x, y:snake.y });//unshift добавлет в начала массива x и y координаты
    
    //если количество дачерних элементов у змейки больше чем разрешено, то мы удаляем последний элемент
    if(snake.tails.length > snake.maxTails){
        snake.tails.pop()
    }

    //перебираем все дочерние элементы у змейки и отрисовываем их попутно проверяя на соприкосновения другс другом и с ягодой
    snake.tails.forEach(function(el, index){
        if(index == 0){
            //красим голову в ярко красный
            context.fillStyle = '#154701';
        } else{
            //красим тело в тусклый
            context.fillStyle = '#1c6300';
        }
        context.fillRect(el.x, el.y, config.sizeCell, config.sizeCell);
        
        //проверяем координаты ягоды и змейки если они совпадают то увеличиваем хвост у змейки 
        if(el.x === berry.x && el.y === berry.y){
            snake.maxTails++;
            //увеличиваем очки
            inScore();
            //создаем новую ягоду
            randomPositionBerry();
        }

        //проверяяем на соприкосновение змейки с хвостом
        for(let i = index + 1; i < snake.tails.length; i++){
            //если координаты совпали то запускаем занова
            if(el.x == snake.tails[i].x && el.y == snake.tails[i].y){
                refreshGame();
            }
        }
    })
}

//если змейка подошла к краю меняем координаты
function collisionBorder(){
    if(snake.x < 0){
        snake.x = canvas.width - config.sizeCell;
    } else if(snake.x >= canvas.width){
        snake.x = 0
    } 

    if(snake.y < 0){
        snake.y = canvas.height - config.sizeCell;
    } else if(snake.y >= canvas.height){
        snake.y = 0
    } 
}



//обнуление всех значений когда змейка сьедает саму себя
function refreshGame(){
    popapOver.style.display = 'flex';

    document.querySelector('.number_result').innerHTML = score;
    
  

    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry()


}

//отвечает за рисование ягоды(добавление на уровень)
function drawBerry(){
    context.beginPath();
    context.fillStyle = '#A00034';

    //окружность на основе координат от ягоды
    context.arc(berry.x + (config.sizeCell / 2), berry.y + (config.sizeCell / 2), config.sizeBarry, 0, 2 * Math.PI);
    context.fill();
}

//функция для рандомных значений у ягоды
function randomPositionBerry(){
    //в функцию передаем 0 и колич ячеек, колич ячеек получаем за счет деление ширины канваса на размер ячейки 
    berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}




//функция для набора очков:



    //увеличивает текущее колич очков на 1
    function inScore(){
        score++;
    
        drawScore();
    }
    //отображает это на странице(кол очков)
    function drawScore(){
        scoreBlock.innerHTML = score;
        
        //отображение рекорда
        recordArr.push(score);
        document.querySelector('.number_rekord').innerHTML = Math.max(...recordArr);
    }


//функция для рандома
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min) + min)
}

//обработчик события на клавишу
document.addEventListener('keydown', function(e){
    //так как движеся постоянно то меняем значение с положительного на отрицательное в зависимости от клавиши
    if(e.code == 'ArrowUp'){
        snake.dy = -config.sizeCell;
        snake.dx = 0;
    } else if(e.code == 'ArrowLeft'){
        snake.dx = -config.sizeCell;
        snake.dy = 0;
    } else if(e.code == 'ArrowDown'){
        snake.dy = config.sizeCell;
        snake.dx = 0;
    } else if(e.code == 'ArrowRight'){
        snake.dx = config.sizeCell;
        snake.dy = 0;
    }
})