import CustomElement from '../utils/_createCustomElement';
import ControllerMain from '../controller/_ControllerMain';
import { stringArrayObject } from '../typingTS/_type';
import { IitemDATA} from '../typingTS/_interfaces'
import { itemFilterCheckbox } from '../utils/utils';
import { MAIN } from '../utils/const';

class ViewMain {
  buttonReset: HTMLElement
  buttonCopy: HTMLElement
  filterCategoryMain: HTMLElement
  filterBrandMain: HTMLElement
  customElement: CustomElement
  _controller: ControllerMain;
  startCategoryData: stringArrayObject
  startBrandData: stringArrayObject
  startServerData: IitemDATA[]

  constructor() {
    this._controller = new ControllerMain();
    this.startCategoryData = this._controller.startCategoryData;
    this.startBrandData = this._controller.startBrandData;
    this.startServerData = this._controller.startServerData;
    this.customElement = new CustomElement();

    this.buttonReset = this.customElement.createElement('button', { className: 'stock__reset _btn', textContent: 'Reset Filter'}); // button Reset
    this.buttonCopy = this.customElement.createElement('button', { className: 'stock__copy _btn', textContent: 'Copy Link'}); // button Copy
    this.filterCategoryMain = this.customElement.createElement('div', { className: 'filter__item-container category__container filter__item-container-scroll'}); // Category
    this.filterBrandMain = this.customElement.createElement('div', { className: 'filter__item-container brand__container filter__item-container-scroll'}); // Brand

    this.create();
    this.headerListeners()
  }


  create(dataFilterCategory: stringArrayObject = this.startCategoryData, dataFilterBrand: stringArrayObject = this.startBrandData) {
    // Создание основной секции
    const pageMain = this.customElement.createElement('div', { className: 'page-main-one _main-container'});
    const mainOne = this.customElement.createElement('div', { className: 'main-one _container'});
    this.customElement.addChildren(pageMain,[mainOne]);

    // Создание ЛЕВОЙ СЕКЦИИ!!!
    const mainLeft = this.customElement.createElement('div', { className: 'main-one__left filter'});
    this.customElement.addChildren(mainOne,[mainLeft]);

    // Создание кнопок
    const containerButtons = this.customElement.createElement('div', { className: 'filter__stock stock'});
    this.customElement.addChildren(mainLeft,[containerButtons]);
    this.customElement.addChildren(containerButtons,[this.buttonReset, this.buttonCopy]);

    // Создание Category
    const filterCategory = this.customElement.createElement('div', { className: 'filter__item filter__category category filter__item-scroll'});
    const filterCategoryItemName = this.customElement.createElement('h3', { className: 'filter__item-name category__name', textContent: 'Category'});
    this.customElement.addChildren(filterCategory,[filterCategoryItemName, this.filterCategoryMain]);
    for (const key in dataFilterCategory) {
      const itemCategory = itemFilterCheckbox(key, dataFilterCategory[key]); // Функция получение разметки определенного чекбокса
      this.customElement.addChildren(this.filterCategoryMain,[itemCategory]);
    }
    this.customElement.addChildren(mainLeft,[filterCategory]);

    // Создание Brand 
    const filterBrand = this.customElement.createElement('div', { className: 'filter__item filter__brand brand filter__item-scroll'});
    const filterBrandItemName = this.customElement.createElement('h3', { className: 'filter__item-name brand__name', textContent: 'Brand'});
    this.customElement.addChildren(filterBrand,[filterBrandItemName, this.filterBrandMain]);
    for (const key in dataFilterBrand) {
      const itemBrand = itemFilterCheckbox(key, dataFilterBrand[key]); // Функция получение разметки определенного чекбокса
      this.customElement.addChildren(this.filterBrandMain,[itemBrand]);
    }
    this.customElement.addChildren(mainLeft,[filterBrand]);

    // Создание Price
    const filterPrice = this.customElement.createElement('div', { className: 'filter__item filter__price price'});
    this.customElement.addChildren(mainLeft,[filterPrice]);

    const filterPriceItemName = this.customElement.createElement('h3', { className: 'filter__item-name price__name', textContent: 'Price'});
    const filterPriceContainer = this.customElement.createElement('div', { className: 'filter__item-container price__container'});
    this.customElement.addChildren(filterPrice,[filterPriceItemName, filterPriceContainer]);

    const itemPriceNumberContainer = this.customElement.createElement('div', { className: 'filter__item-data item-price'});
    const itemPriceInputContainer = this.customElement.createElement('div', { className: 'range-slider'});
    this.customElement.addChildren(filterPriceContainer,[itemPriceNumberContainer, itemPriceInputContainer]);

    const itemPriceNumberFrom = this.customElement.createElement('div', { className: 'item-price__from', textContent: '0'});
    const itemPriceNumberMid = this.customElement.createElement('div', { textContent: '⟷'});
    const itemPriceNumberTo = this.customElement.createElement('div', { className: 'item-price__to', textContent: '100'});
    this.customElement.addChildren(itemPriceNumberContainer,[itemPriceNumberFrom, itemPriceNumberMid, itemPriceNumberTo]);

    const itemPriceInputOne = this.customElement.createElement('input', { type: 'range', step: '1', min: '0', max:'100', id:'slider1'});
    itemPriceInputOne.setAttribute('value', '0')
    const itemPriceInputTwo = this.customElement.createElement('input', { type: 'range', step: '1', min: '0', max:'100', id:'slider2'});
    itemPriceInputTwo.setAttribute('value', '100')
    this.customElement.addChildren(itemPriceInputContainer,[itemPriceInputOne, itemPriceInputTwo]);
    
    // const main = document.querySelector('main') as HTMLElement ;
    // Закинуть в мейн filterCategory, filterBrand
    // main.append(filterCategory)
    // MAIN.append(filterCategory, filterBrand);
    this.customElement.addChildren(MAIN,[pageMain]);
  }


  headerListeners() {
    this.filterCategoryMain.addEventListener('click', this.onheaderBasketClick);
    this.filterBrandMain.addEventListener('click', this.onheaderBasketClick);
  }

  private onheaderBasketClick = (e:Event) => {
    console.log(e);
  }

}

export default ViewMain


// const divclick = document.querySelector(".filter__item-container") as HTMLElement;

// if (divclick) {

//   divclick.addEventListener('click', (e: Event) => {

//     const target = e.target as HTMLElement;

//     if (target.getAttribute('type') === "checkbox") {
//       console.log(e)
//     }

//   })}