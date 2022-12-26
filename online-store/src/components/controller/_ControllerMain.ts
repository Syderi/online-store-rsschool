// Типы интерфейсы
import { stringArrayObject } from '../typingTS/_type'
import { IitemDATA, IFilter, IBascetLocalStorage } from '../typingTS/_interfaces'

// Модель
import CreateFilterData from '../model/_ModelCreateFilterData'

// VIEWS

import ViewHeader from '../view/_ViewHeader';
import ViewMainPage from '../view/_ViewMainPage';
import ViewFooter from '../view/_ViewFooter';
import ViewItemCardPage from '../view/_ViewItemCardPage';
import ViewBasketPage from '../view/_ViewBasketPage';

// Служебные программки
import CustomElement from '../utils/_createCustomElement';
import FormatURL from '../utils/_formatUrl';
import * as noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css';



class ControllerMain {

  BascetLocalStorage: IBascetLocalStorage[]

  routes: {
    [key: string]: {
      name: string;
      routesPage: (x: string) => void;
    }
  };

  customElement: CustomElement

  MODEL: CreateFilterData;
  ViewHEADER: ViewHeader;
  ViewMainPAGE: ViewMainPage;
  ViewFOOTER: ViewFooter;
  ViewItemCardPAGE: ViewItemCardPage;
  ViewBASKETPAGE: ViewBasketPage

  _formatURL: FormatURL;

  FILTER: IFilter;

  BODY: HTMLElement
  HEADER: HTMLElement
  MAIN: HTMLElement
  FOOTER: HTMLElement

  readonly startCategoryData: stringArrayObject;
  readonly startBrandData: stringArrayObject;
  readonly startServerData: IitemDATA[];

  readonly startPriceOfFILTER: number[];
  readonly startStockOfFILTER: number[];
  readonly startSearchOfFILTER: string[];

  readonly priceOfFILTER: number[];
  readonly stockOfFILTER: number[];
  readonly searchOfFILTER: string[];
  sortOfFILTER: string[];

  constructor() {

    const readlocalStorage = localStorage.getItem('BascetLocalStorage')
    if (readlocalStorage) {
      this.BascetLocalStorage = JSON.parse(readlocalStorage)
    } else {
      this.BascetLocalStorage = []
    }

    // console.log('this.BascetLocalStorage', this.BascetLocalStorage)

    this.customElement = new CustomElement();
    this._formatURL = new FormatURL();


    this.BODY = document.body
    this.HEADER = this.customElement.createElement('header', { className: "page-header _main-container" });
    this.MAIN = this.customElement.createElement('main');
    this.FOOTER = this.customElement.createElement('footer', { className: "page-footer _main-container" });
    this.customElement.addChildren(this.BODY, [this.HEADER, this.MAIN, this.FOOTER])

    this.MODEL = new CreateFilterData();
    this.ViewHEADER = new ViewHeader();
    this.ViewFOOTER = new ViewFooter();


    this.FILTER = this.MODEL.FILTER
    this.startCategoryData = this.MODEL.startCategoryData
    this.startBrandData = this.MODEL.startBrandData
    this.startServerData = this.MODEL.startServerData
    // Значиния для установки минимальных и максимальных значений инпута и строки поиска
    this.startPriceOfFILTER = this.MODEL.startPriceOfFILTER
    this.startStockOfFILTER = this.MODEL.startStockOfFILTER
    this.startSearchOfFILTER = this.MODEL.startSearchOfFILTER
    // Будущие значения для установки велью инпутов и строки поиска
    this.priceOfFILTER = this.MODEL.priceOfFILTER
    this.stockOfFILTER = this.MODEL.stockOfFILTER
    this.searchOfFILTER = this.MODEL.searchOfFILTER
    this.sortOfFILTER = this.MODEL.sortOfFILTER

    this.ViewMainPAGE = new ViewMainPage(this.startServerData,
      this.startCategoryData,
      this.startBrandData,
      this.startPriceOfFILTER,
      this.startStockOfFILTER,
      this.sortOfFILTER);
    this.ViewItemCardPAGE = new ViewItemCardPage(this.startServerData[0]);
    this.ViewBASKETPAGE = new ViewBasketPage(this.startServerData)

    this.ListenersController()

    this.routes = {
      '/page404': {
        name: 'Page not found',
        routesPage: this.routesFuntion.bind(this)
      },
      '/product': {
        name: 'Product details',
        routesPage: this.renderItemCardPAGEFromRouter.bind(this)
      },
      '/basket': {
        name: 'Backet',
        routesPage: this.renderBacket.bind(this)
      },
      '/': {
        name: 'Home',
        routesPage: this.renderMainPageFromRouter.bind(this)
      },
    };

  }

  // Конец конструктора

  // МЕТОД добавления и удаления  ПО ID из КОРЗИНЫ
  updateBascetLocalStorage(id: number, key: boolean = true): IBascetLocalStorage[] {

    const index = this.BascetLocalStorage.findIndex((el, index) => {
      return el.id === id
    })

    if (index === -1) {
      this.BascetLocalStorage.push(this.convertIDtoBascetObject(id))
    } else if (index !== -1 && key) {
      this.BascetLocalStorage.splice(index, 1);
    }

    localStorage.setItem('BascetLocalStorage', JSON.stringify(this.BascetLocalStorage))
    return this.BascetLocalStorage
  }

  // МЕТОД возврата ОБЪЕКТА ПО ID для КОРЗИНЫ
  convertIDtoBascetObject(id: number): IBascetLocalStorage {
    return {
      id: id,
      price: this.MODEL.startServerData[id - 1].price,
      count: 1,
    }
  }

  init() {
    this.startRouteListenner();
    this.handleLocation();
    this.HEADER.append(this.ViewHEADER.create())
    this.FOOTER.append(this.ViewFOOTER.create())

    this.ViewHEADER.updateHeaderBasketCount(this.BascetLocalStorage.length)

    const summTotal = this.BascetLocalStorage.reduce((summ, el) => summ + el.price * el.count, 0)// возможно эти 2 надо вынести в отельный метод
    this.ViewHEADER.updateHeaderTotalPrice(summTotal)// возможно эти 2 надо вынести в отельный метод
  }


  // Рендер главной страницы из роутера
  renderMainPageFromRouter(name: string) {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    const filter = this._formatURL.createObjectFromURLSearchParams(search)
// console.log('ИЗ ЛОВЛИ РОУТЕРА ФИЛЬТЕР С АДРЕСНОЙ СТРОКИ',filter)

    this.MODEL.setFILTER(filter)
    this.rerenderMainPageComponents()
  }

  // Рендер КОМПАНЕНТОВ главной страницы из роутера
  rerenderMainPageComponents() {
    if (this.MAIN.firstChild === this.ViewMainPAGE.pageMain) {
      // console.log('this.MAIN.firstChild первая ветка', this.MAIN.firstChild)
      // this.MAIN.append(this.ViewMainPAGE.create())
      this.viewMainPAGEupdate();
    } else {
      // console.log('this.MAIN.firstChild вторая ветка', this.MAIN.firstChild)
      this.MAIN.innerHTML = ''
      // console.log('this.MAIN.firstChild вторая ветка Обнулили', this.MAIN.firstChild)
      this.viewMainPAGEupdate()
      // console.log('300 =this.sortOfFILTER РЕНДЕР', this.sortOfFILTER)
      // console.log('400 =this.MODEL.FILTER РЕНДЕР', this.MODEL.FILTER)
      this.MAIN.append(this.ViewMainPAGE.create(this.MODEL.filtredData,
        this.MODEL.filtredCategoryData,
        this.MODEL.filtredBrandData,
        this.priceOfFILTER,
        this.stockOfFILTER,
        this.sortOfFILTER))
    }

    if (document.querySelector('.noUi-base') === null) {
      this.fnSliderPrice(); // Создание noUISlider на цену
      this.fnSliderStock(); // Создание noUISlider на количество 
    }
  }
  // Подфунция рендора Компанента главной страниц из роутера Мейна
  viewMainPAGEupdate() {
    this.sortOfFILTER = this.MODEL.sortOfFILTER
    this.ViewMainPAGE.updateCardList(this.MODEL.filtredData)
    this.ViewMainPAGE.updateBrandBlock(this.MODEL.filtredBrandData)
    this.ViewMainPAGE.updateCategoryBlock(this.MODEL.filtredCategoryData)
    this.ViewMainPAGE.updateSearchValue(this.MODEL.searchOfFILTER[0])
  }

  // Рендер главной страницы ПРОДУКТА из роутера
  renderItemCardPAGEFromRouter(name: string) {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    console.log('search!!!!!!!!', this._formatURL.createIDFromURLSearchParams(search))
    const id = this._formatURL.createIDFromURLSearchParams(search).id
    // const filter = this._formatURL.createObjectFromURLSearchParams(search)
    // this.MODEL.setFILTER(filter)
    // this.rerenderMainPageComponents()
    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewItemCardPAGE.create(this.MODEL.startServerData[Number(id) - 1]))
  }

  // Рендер корзины
  renderBacket(name: string) {
    document.title = `Store - ${name}`;
    // const search = new URLSearchParams(window.location.search);
    // console.log('search!!!!!!!!', this._formatURL.createIDFromURLSearchParams(search))
    // const id = this._formatURL.createIDFromURLSearchParams(search).id

    this.MAIN.innerHTML = ''
    this.MAIN.append(this.ViewBASKETPAGE.create(this.generateProductsForBascet())) // НЕ ДОРАБОТАНО ПОЛУЧАТЬ ДАННЫЕ ИЗ ЛОКАЛ СТОРИДЖ
  }

  // Метод получения товаров в корзину по Списку из ЛОКАЛ СТОРИДЖ
  generateProductsForBascet(localData: IBascetLocalStorage[] = this.BascetLocalStorage): IitemDATA[] {
    return this.startServerData.filter((el) => {

      for (let index = 0; index < localData.length; index++) {
        if (el.id === localData[index].id) return true

      }

    })
  }


  routesFuntion(name: string) {
    document.title = `Store - ${name}`;
    this.MAIN.innerHTML = 'СТРАНИЦА НЕ НАЙДЕНА.'
    window.history.pushState({}, '', `/page404`)
  }

  // Главыный слушаетль на кнопках АДРЕССНОЙ СТРОКИ
  startRouteListenner() {
    window.onpopstate = (event: PopStateEvent) => {
      event.preventDefault()
      this.handleLocation()
    };
  }
  // Метод распределения направлений
  handleLocation() {
    const path = window.location.pathname;
    const route = this.routes[path] || this.routes['/page404'];
    route.routesPage(route.name);
  }

  // Запись в историю адрессной строки с событий МЕЙНА
  pushStateFilter(filter = this.MODEL.FILTER) {
    const params: URLSearchParams = this._formatURL.createURLSearchParams(filter)
    if (JSON.stringify(this.FILTER) === JSON.stringify(this.MODEL.startServerFILTER)) {
      // console.log('pushStateFilter ПЕРВАЯ ВЕТКА фильтрованный массив равен стартовому')
      window.history.replaceState({}, '', '/')
    } else {
      // console.log('pushStateFilter Вторая ВЕТКА фильтрованный массив НЕ равен стартовому')
      // console.log(`{window.location.pathname}`)
      window.history.pushState({}, '', `/?${params}`)
    }
  }

  // СЛУШАТЕЛИ СОБЫТИЙ
  ListenersController() {

    // Ловля клика по Инпутам категорий из Мейна
    this.MAIN.addEventListener('clickOnCategoryMain', (e) => {
      const target = e.target as HTMLElement;
      this.MODEL.setFILTERCategory(target.id)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
    })
    // Ловля клика по Инпутам brend из Мейна
    this.MAIN.addEventListener('clickOnBrandMain', (e) => {
      const target = e.target as HTMLElement;
      this.MODEL.setFILTERBrand(target.id)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
    })

    // Ловля изменения инпута СЕРЧ
    this.MAIN.addEventListener('changeOnSearchMain', (e) => {
      const target = e.target as HTMLInputElement;

      this.MODEL.setSearchOfFILTER(target.value)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
    })

    // Ловля изменения СОРТИРОВКИ
    this.MAIN.addEventListener('choiceOnSortMain', (e) => {
      const target = e.target as HTMLSelectElement;
      console.log('500 = target.value', target.value)


      this.MODEL.setSortOfFILTER(target.value)
      // this.sortOfFILTER = this.MODEL.sortOfFILTER
      console.log('ОБНОВИЛАСЬ ЛИ СОРТИРОВКА', this.sortOfFILTER)
      console.log('ОБНОВИЛАСЬ ЛИ СОРТИРОВКА модель', this.MODEL.sortOfFILTER)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
    })

    // Клик по кнопке РЕСЕТ сброса фильтров из Мейна
    this.MAIN.addEventListener('clickOnbuttonResetMain', (e) => {
      this.MODEL.clearFILTER()
      this.rerenderMainPageComponents()
      this.pushStateFilter()

    })

    // Клик по корзине из Хедера и запуск страницы корзины
    this.BODY.addEventListener('clickOnBacket', (e) => {
      this.MAIN.innerHTML = ''
      // console.log('this.generateProductsForBascet()====',this.generateProductsForBascet())
      this.MAIN.append(this.ViewBASKETPAGE.create(this.generateProductsForBascet())) // НЕ ДОРАБОТАНО ПОЛУЧАТЬ ДАННЫЕ ИЗ ЛОКАЛ СТОРИДЖ
      window.history.pushState({}, '', '/basket')
    })

    // Клик по ЛОГОТИПУ из Хедера и запуск страницы корзины
    this.BODY.addEventListener('clickOnLogo', (e) => {
      // this.MAIN.innerHTML = ''
      // console.log('EEEEEEEEEEEEEEEEEEEEE', e)
      this.rerenderMainPageComponents()
      this.pushStateFilter()
      // window.history.pushState({}, '', '/')
    })



    // Клик по карточке для запуска страницы продукта из Мейна
    this.MAIN.addEventListener('clickOnСardListMain', (e) => {
      const target = e.target as HTMLElement;
      const id = target.id
      this.MAIN.innerHTML = ''
      this.MAIN.append(this.ViewItemCardPAGE.create(this.MODEL.startServerData[Number(id) - 1]))
      // console.log(`ПУШНУЛ ИСТОРИ ОДНОГО ПРОДУКТА /product?id=${id}`)
      window.history.pushState({}, '', `/product?id=${id}`)
    })

    // Клик по карточке для добавления  продукта в КОРЗИНУ из Мейна
    this.MAIN.addEventListener('clickOnProductAddInBascetMain', (e) => {
      const target = e.target as HTMLElement;
      const id = +target.id.split('|')[1]
      console.log("target.id.split('|')[0]", target.id.split('|')[0])
      const key: boolean = target.id.split('|')[0] === 'button-buy' ? false : true
      console.log("key", key)
      this.updateBascetLocalStorage(id, key)
      this.ViewHEADER.updateHeaderBasketCount(this.BascetLocalStorage.length)

      const summTotal = this.BascetLocalStorage.reduce((summ, el) => summ + el.price * el.count, 0)// возможно эти 2 надо вынести в отельный метод
      this.ViewHEADER.updateHeaderTotalPrice(summTotal)// возможно эти 2 надо вынести в отельный метод

    })
  }

  fnSliderPrice() {

    // this.silderPrice = this.customElement.createElement('div', { id: 'sliderPrice' }); // No Ui Slider Price
    // this.silderStock = this.customElement.createElement('div', { id: 'sliderStock' }); // No Ui Slider Stock
    // const sliderPrice = document.getElementById('sliderPrice') as noUiSlider.target;

    if(this.ViewMainPAGE.silderPrice) {
      noUiSlider.create(this.ViewMainPAGE.silderPrice, {
        start: [this.priceOfFILTER[0], this.priceOfFILTER[1]],
        connect: true,
        step: 1,
        range: {
            'min': this.startPriceOfFILTER[0],
            'max': this.startPriceOfFILTER[1],
        }
      });

       // const inputPrice1 = document.querySelector('.item-price__from') as HTMLInputElement;
      // const inputPrice2 = document.querySelector('.item-price__to') as HTMLInputElement;
      const inputs = [this.ViewMainPAGE.itemPriceNumberFrom,  this.ViewMainPAGE.itemPriceNumberTo];
    
      (this.ViewMainPAGE.silderPrice as noUiSlider.target).noUiSlider?.on('update',
       function(values: (string | number)[], handle: number): void { 
        inputs[handle].textContent = String(Math.round(Number(values[handle])));
      });

      (this.ViewMainPAGE.silderPrice as noUiSlider.target).noUiSlider?.on('set', (values, handle) => {
        const valueArray = values.map(el => Math.round(+el))
        console.log('roundVal',valueArray)
        this.MODEL.setPriceOfFILTER(valueArray)
        this.rerenderMainPageComponents()
        this.pushStateFilter()
      });



    }
  }

  fnSliderStock() {
    // const sliderStock = document.getElementById('sliderStock') as noUiSlider.target;
  
    if(this.ViewMainPAGE.silderStock) {
      noUiSlider.create(this.ViewMainPAGE.silderStock, {
        start: [this.stockOfFILTER[0], this.stockOfFILTER[1]],
        connect: true,
        step: 1,
        range: {
            'min': this.startStockOfFILTER[0],
            'max': this.startStockOfFILTER[1],
        }
      });


    // this.ViewMainPAGE.itemStockNumberFrom  this.itemStockNumberFrom = this.customElement.createElement('div', { className: 'item-stock__from' }); // Stock Text Min
    // this.itemStockNumberTo = this.customElement.createElement('div', { className: 'item-stock__to' }); // Stock Text Max
    
      // const inputStock1 = document.querySelector('.item-stock__from') as HTMLInputElement;
      // const inputStock2 = document.querySelector('.item-stock__to') as HTMLInputElement;
      const inputs = [this.ViewMainPAGE.itemStockNumberFrom, this.ViewMainPAGE.itemStockNumberTo];
    
      (this.ViewMainPAGE.silderStock as noUiSlider.target).noUiSlider?.on('update',
       function(values: (string | number)[], handle: number): void { 
        inputs[handle].textContent = String(Math.round(Number(values[handle])));

        // this.ViewMainPAGE.silderStock.noUiSlider.get(true)
      });

      (this.ViewMainPAGE.silderStock as noUiSlider.target).noUiSlider?.on('set', (values, handle) => {
        const valueArray = values.map(el => Math.round(+el))
        console.log('roundVal',valueArray)
        this.MODEL.setStockOfFILTER(valueArray)
        this.rerenderMainPageComponents()
        this.pushStateFilter()
      });



    }
  }

}

export default ControllerMain

// export function processOrder(time: number): Promise<void> {
//   return new Promise((res) => setTimeout(res, time));
// }