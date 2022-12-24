// Типы интерфейсы
import { stringArrayObject } from '../typingTS/_type'
import { IitemDATA, IFilter } from '../typingTS/_interfaces'

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
// import state from '../utils/state';
// import Router from '../router';

class ControllerMain {

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

  constructor() {

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

    this.ViewMainPAGE = new ViewMainPage(this.startServerData, this.startCategoryData, this.startBrandData, this.startPriceOfFILTER, this.startStockOfFILTER);
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

  init() {
    this.startRouteListenner();
    this.handleLocation();
    this.HEADER.append(this.ViewHEADER.create())
    this.FOOTER.append(this.ViewFOOTER.create())


  }

  // Рендер главной страницы из роутера
  renderMainPageFromRouter(name: string) {
    document.title = `Store - ${name}`;
    const search = new URLSearchParams(window.location.search);
    const filter = this._formatURL.createObjectFromURLSearchParams(search)
    this.MODEL.setFILTER(filter)
    this.rerenderMainPageComponents()
  }

  // Рендер КОМПАНЕНТОВ главной страницы из роутера
  rerenderMainPageComponents() {
    if (this.MAIN.firstChild === this.ViewMainPAGE.pageMain) {
      // console.log('this.MAIN.firstChild первая ветка', this.MAIN.firstChild)
      // this.MAIN.append(this.ViewMainPAGE.create())
      this.viewMainPAGEupdate()
    } else {
      // console.log('this.MAIN.firstChild вторая ветка', this.MAIN.firstChild)
      this.MAIN.innerHTML = ''
      // console.log('this.MAIN.firstChild вторая ветка Обнулили', this.MAIN.firstChild)
      this.viewMainPAGEupdate()
      this.MAIN.append(this.ViewMainPAGE.create())
    }
  }
  // Подфунция рендора Компанента главной страниц из роутера Мейна
  viewMainPAGEupdate() {
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
    this.MAIN.append(this.ViewBASKETPAGE.create(this.MODEL.startServerData)) // НЕ ДОРАБОТАНО ПОЛУЧАТЬ ДАННЫЕ ИЗ ЛОКАЛ СТОРИДЖ
  }

  routesFuntion(name: string) {
    document.title = `Store - ${name}`;
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
      window.history.replaceState({}, '', '/')
    } else {
      window.history.pushState({}, '', `?${params}`)
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

    // Клик по кнопке РЕСЕТ сброса фильтров из Мейна
    this.MAIN.addEventListener('clickOnbuttonResetMain', (e) => {
      this.MODEL.clearFILTER()
      this.rerenderMainPageComponents()
      this.pushStateFilter()

    })

    // Клик по корзине из Хедера и запуск страницы корзины
    this.BODY.addEventListener('clickOnBacket', (e) => {
      this.MAIN.innerHTML = ''
      this.MAIN.append(this.ViewBASKETPAGE.create(this.MODEL.startServerData)) // НЕ ДОРАБОТАНО ПОЛУЧАТЬ ДАННЫЕ ИЗ ЛОКАЛ СТОРИДЖ
      window.history.pushState({}, '', '/basket')
    })



    // Клик по карточке для запуска страницы продукта из Мейна
    this.MAIN.addEventListener('clickOnСardListMain', (e) => {
      const target = e.target as HTMLElement;
      const id = target.id
      this.MAIN.innerHTML = ''
      this.MAIN.append(this.ViewItemCardPAGE.create(this.MODEL.startServerData[Number(id) - 1]))
      console.log(`ПУШНУЛ ИСТОРИ ОДНОГО ПРОДУКТА /product?id=${id}`)
      window.history.pushState({}, '', `/product?id=${id}`)
    })


  }



}

export default ControllerMain

// export function processOrder(time: number): Promise<void> {
//   return new Promise((res) => setTimeout(res, time));
// }