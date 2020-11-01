"use strict";
var map = document.querySelector(".map");
var data = [];

// Обьект с базовыми сначениями
var ORIGINAL_OPTIONS = {
    AUTHOR: {
        AVATAR: []
    },
    OFFER: {
        TITTLE: [
            "Большая уютная квартира",
            "Маленькая неуютная квартира",
            "Огромный прекрасный дворец",
            "Маленький ужасный дворец",
            "Красивый гостевой домик",
            "Некрасивый негостепреимный домик",
            "Уютное бунгало далеко от моря",
            "Неуютное бунгало по колено в воде"
        ],
        PRICE: {
            MIN: 1000,
            MAX: 1000000
        },
        TYPE: [
            "palace",
            "flat",
            "house",
            "bungalow"
        ],
        ROOMS: {
            MIN: 1,
            MAX: 5
        },
        GUESTS: {
            MIN: 1,
            MAX: 10
        },
        CHECKIN: [
            "12:00",
            "13:00",
            "14:00"
        ],
        CHECKOUT: [
            "12:00",
            "13:00",
            "14:00"
        ],
        FEATURES: [
            "wifi",
            "dishwasher",
            "parking",
            "washer",
            "elevator",
            "conditioner"
        ],
        DESCRIPTION: "",
        PHOTOS: [
            "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
            "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
            "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
        ],
    },
    LOCATIONS: {
        X: {
            MIN: 300,
            MAX: 900
        },
        Y: {
            MIN: 130,
            MAX: 630
        }
    }
};

// Функция для нахождения случайного числа из интервала
function getRandomFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Функция для нахождения случайного элемента в масиве
function getRandomArrayItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Функция для создания рандомного масива из другого масива
function getRandomArray(arr) {
    var newArray = [];
    var newArrayLength = getRandomFromInterval(1 , arr.length);
    var copiedArray = arr.slice();
    for (var i = 0; i < newArrayLength; i++) {
        var randomElement = getRandomFromInterval(0, copiedArray.length);
        newArray[i] = copiedArray.splice(randomElement, 1);
        newArrayLength--
    }
    return newArray;
}

// Функция для рандомной сортировки масива
function randomSortedArray(arr) {
    var copiedArray = arr;
    copiedArray.sort(function () {
        return Math.random() - 0.5;
    });
    return copiedArray;
}


// Наполнения ORIGINAL_OPTIONS.AUTHOR.AVATAR аддресами изображений
function fillAvatars () {
    for (var i = 0; i < 8; i++) {
        ORIGINAL_OPTIONS.AUTHOR.AVATAR[i] = "img/avatars/user" + ("0" + (i + 1)) + ".png";
    }
    return ORIGINAL_OPTIONS.AUTHOR.AVATAR;
}
fillAvatars();

// Создание обьекта с данными обьявлений
function createDataArray (array, arrayItems) {
    for (var i = 0; i < arrayItems; i++) {
        var locationX = getRandomFromInterval(ORIGINAL_OPTIONS.LOCATIONS.X.MIN, ORIGINAL_OPTIONS.LOCATIONS.X.MAX);
        var locationY = getRandomFromInterval(ORIGINAL_OPTIONS.LOCATIONS.Y.MIN, ORIGINAL_OPTIONS.LOCATIONS.Y.MAX);
        array[i] = {
            author: {
                avatar: ORIGINAL_OPTIONS.AUTHOR.AVATAR[i]
            },
            offer: {
                title: ORIGINAL_OPTIONS.OFFER.TITTLE[i],
                address: locationX + ", " + locationY,
                price: getRandomFromInterval(ORIGINAL_OPTIONS.OFFER.PRICE.MIN, ORIGINAL_OPTIONS.OFFER.PRICE.MAX),
                type: getRandomArrayItem(ORIGINAL_OPTIONS.OFFER.TYPE),
                rooms: getRandomFromInterval(ORIGINAL_OPTIONS.OFFER.ROOMS.MIN, ORIGINAL_OPTIONS.OFFER.ROOMS.MAX),
                guests: getRandomFromInterval(ORIGINAL_OPTIONS.OFFER.GUESTS.MIN, ORIGINAL_OPTIONS.OFFER.GUESTS.MAX),
                checkin: getRandomArrayItem(ORIGINAL_OPTIONS.OFFER.CHECKIN),
                checkout: getRandomArrayItem(ORIGINAL_OPTIONS.OFFER.CHECKOUT),
                features: getRandomArray(ORIGINAL_OPTIONS.OFFER.FEATURES),
                description: ORIGINAL_OPTIONS.OFFER.DESCRIPTION,
                photos: randomSortedArray(ORIGINAL_OPTIONS.OFFER.PHOTOS)
            },
            location: {
                x: locationX,
                y: locationY
            }
        }
    }
    return array;
}

createDataArray(data, 8);

// Удаление класа map--faded
map.classList.remove("map--faded");

// создание DOM-элемента соответствуещего метке на карте
function mapPin(data) {
    var mapPin = document.querySelector(".map__pin").cloneNode(true);
    var pinHeight = 40;
    var pinWidth = 40;
    mapPin.style.left = (data.location.x + (pinWidth / 2)) + "px";
    mapPin.style.top = (data.location.y + pinHeight) + "px";
    mapPin.setAttribute("src", data.author.avatar);
    mapPin.setAttribute("alt", data.offer.title);
    return mapPin;
}

// Создание DOM-элемента обьявления
function createOffer(data) {
    var mapCardTemplate = document.querySelector("template").content.querySelector(".map__card");
    var mapCard = mapCardTemplate.cloneNode(true);
    mapCard.querySelector(".popup__title").textContent = data.offer.title;
    mapCard.querySelector(".popup__text--address").textContent = data.offer.address;
    mapCard.querySelector(".popup__text--price").textContent = data.offer.price + "₽/ночь";
    if (data.offer.type === "flat") {
        mapCard.querySelector(".popup__type").textContent = "Квартира";
    } else if (data.offer.type === "bungalo") {
        mapCard.querySelector(".popup__type").textContent = "Бунгало";
    } else if (data.offer.type === "house") {
        mapCard.querySelector(".popup__type").textContent = "Дом";
    } else if (data.offer.type === "palace") {
        mapCard.querySelector(".popup__type").textContent = "Дворец";
    }
    mapCard.querySelector(".popup__text--capacity").textContent = data.offer.rooms + " комнаты для " + data.offer.guests +" гостей";
    mapCard.querySelector(".popup__text--time").textContent = "Заезд после " + data.offer.checkin + " выезд до " + data.offer.checkout;

    mapCard.querySelector(".popup__features").innerHTML = "";
    for (var i = 0; i < data.offer.features.length; i++) {
        mapCard.querySelector(".popup__features").innerHTML += "<li class=\"feature feature--" + data.offer.features[i] + "\"></li>";
    }
    mapCard.querySelector(".popup__description").textContent = data.offer.description;
    mapCard.querySelector(".popup__pictures").innerHTML = "";
    for (var j = 0; j < data.offer.photos.length; j++) {
        mapCard.querySelector(".popup__pictures").innerHTML += "<li><img style=\"width: 100%\" src=" + data.offer.photos[j] + "></li>";
    }
    mapCard.querySelector(".popup__avatar").setAttribute("src", data.author.avatar);

    return mapCard;
}

// Отрисовка .map__pin на карте
var mapPins = document.querySelector(".map__pins");
var mapPinsFragment = document.createDocumentFragment();

for (var i = 0; i < data.length; i++) {
    mapPinsFragment.appendChild(mapPin(data[i]));
}

mapPins.appendChild(mapPinsFragment);

// Создает  фрагмент 'fragment'
var fragment = document.createDocumentFragment();

// Заполняем фрагмент данными из массива объектов для отрисовки первой карточки недвижимости
fragment.appendChild(createOffer(data[0]));

// Добавляем карточку недвижимости на страницу
map.appendChild(fragment);


console.log(createOffer(data[0]));
