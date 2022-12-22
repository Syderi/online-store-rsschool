import { IitemDATA, IFilter } from '../typingTS/_interfaces'
import { stringObject, stringArrayObject } from '../typingTS/_type';
import state from '../utils/state'

import CreateBaseDate from "./_CreateBaseData"

class CreateFilterData {
  private readonly _baseData: CreateBaseDate;
  private readonly _startCategoryArray: string[];
  private _startCategoryData: stringArrayObject;
  protected _filtredCategoryData: stringArrayObject;
  private readonly _startBrandArray: string[];
  private _startBrandData: stringArrayObject;
  protected _filtredBrandData: stringArrayObject;
  private readonly _startServerData: IitemDATA[];
  private _filtredData: IitemDATA[];
  protected _FILTER: IFilter;
  private readonly _startServerFILTER: IFilter;

  protected readonly _startPriceOfFILTER: number[];
  protected readonly _startStockOfFILTER: number[];
  protected readonly _startSearchOfFILTER: string[];

  protected readonly _priceOfFILTER: number[];
  protected readonly _stockOfFILTER: number[];
  protected readonly _searchOfFILTER: string[];

  constructor() {
    this._baseData = new CreateBaseDate();

    this._startCategoryArray = this.baseData.category;
    this._startBrandArray = this.baseData.brand;
    this._startServerData = this.baseData.data;

    this._filtredData = this.baseData.data;

    this._startServerFILTER = 
    {
      "category": [],
      "brand": [],
      "price": this.baseData.price,
      "stock": this.baseData.stock,
      // "price": [10, 1749],
      // "stock": [2, 150],
      "search": [''],
      "sort":[''],
    };
    this._FILTER = state
    this._FILTER.price = this.baseData.price
    this._FILTER.stock = this.baseData.stock,

    // console.log("this._FILTER",this._FILTER)
    // console.log("state",state)

    this._startPriceOfFILTER = this._startServerFILTER.price
    this._startStockOfFILTER = this._startServerFILTER.stock
    this._startSearchOfFILTER = this._startServerFILTER.search

    this._priceOfFILTER = this._FILTER.price
    this._stockOfFILTER = this._FILTER.stock
    this._searchOfFILTER = this._FILTER.search


    // this.setSearchOfFILTER('iPhone 9')
    // this.setFILTERcategory('groceries')
    // this.setPriceOfFILTER([500,900])
    // this.setStockOfFILTER([30,100])
    // this.updateFILTER_Price_Stock()

    this._startCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category");
    this._filtredCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category", this.filtredData);
    this._startBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand");
    this._filtredBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand", this.filtredData);


    // console.log("222 this.FILTER", this.FILTER)
    // console.log("333 filtredData =====", this.filtredData)
    // console.log("444 this.filtredCategoryData", this.filtredCategoryData)
    // console.log("555 this.filtredBrandData", this.filtredBrandData)
  }
  // ссылка на класс Базы данных
  public get baseData() {
    return this._baseData
  }

  // обновляем мин и мак цены и количества товара в FILTER
  updateFILTER_Price_Stock(data: IitemDATA[] = this.filtredData) {
    const price: number[] = []
    const stock: number[] = []

    if (data.length === 0) {
      this._FILTER.price = new Array(2).fill(this.startServerFILTER.price[0])
      this._FILTER.stock = new Array(2).fill(this.startServerFILTER.stock[0])
      // this._FILTER.price = [0,0]
      // this._FILTER.stock = [0,0]

    } else if (data.length === 1) {
      console.log("new Array(2).fill(data[0].price)",new Array(2).fill(data[0].price))
      this._FILTER.price = new Array(2).fill(data[0].price)
      this._FILTER.stock = new Array(2).fill(data[0].stock)
    } else {
    this._FILTER.price = data.reduce((res, product) => {
      res.push(product.price)
      return res
    }, price).sort((a, b) => a - b)
      .filter((item, index, arr) => index === 0 || index === (arr.length - 1))

    this._FILTER.stock = data.reduce((res, product) => {
      res.push(product.stock)
      return res
    }, stock).sort((a, b) => a - b)
      .filter((item, index, arr) => index === 0 || index === (arr.length - 1))
    }

  }

  // метод добавления и удаления значений в FILTER.category
  setFILTERcategory(data: string) {
    const index = this._FILTER.category.indexOf(data);
    if (index !== -1) {
      this._FILTER.category.splice(index, 1);
    } else {
      this._FILTER.category.push(data)
    }
    // this.updateFILTER_Price_Stock()
    this.updateFiltredData()
    this.updateFILTER_Price_Stock()

  }

  // метод УСТАНОВКИ массива цены фильтра
  setPriceOfFILTER(data: number[] = this.startServerFILTER.price) {
    this._FILTER.price = data;
    this.updateFiltredData()
    this.updateFILTER_Price_Stock()
  }
  // метод Установки массива колличества товара фильтра
  setStockOfFILTER(data: number[] = this.startServerFILTER.stock) {
    this._FILTER.stock = data;
    this.updateFiltredData()
    this.updateFILTER_Price_Stock()
  }

  // метод Установки поиска товара фильтра
  setSearchOfFILTER(data: string = this.startServerFILTER.search[0]) {
    this._FILTER.search[0] = data;
    this.updateFiltredData()
    this.updateFILTER_Price_Stock()
  }

  // возвращает стартовый массив категорий
  public get startCategoryArray() {
    return this._startCategoryArray
  }

  // возвращает стартовый массив брендов
  public get startBrandArray() {
    return this._startBrandArray
  }

  // возвращает стартовый Объект категорий
  public get startCategoryData() {
    this._startCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category");
    return this._startCategoryData
  }

  // возвращает измененный Объект категорий по this._filtredData
  public get filtredCategoryData() {
    this._filtredCategoryData = this.getCategoryAndBrandData(this.startCategoryArray, "category", this.filtredData);
    return this._filtredCategoryData
  }

  // возвращает стартовый Объект брендов
  public get startBrandData() {
    this._startBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand");
    return this._startBrandData
  }

  // возвращает измененный Объект брендов по this._filtredData
  public get filtredBrandData() {
    this._filtredBrandData = this.getCategoryAndBrandData(this.startBrandArray, "brand", this.filtredData);
    return this._filtredBrandData
  }

  // возвращает стартовый Объект c данными ПРОДУКТА
  public get startServerData() {
    return this._startServerData
  }
  // возвращает измененный Объект c данными ПРОДУКТА
  public get filtredData() {
    this.updateFiltredData();
    return this._filtredData
  }

  // возвращает стартовый Объект Фильтра
  public get startServerFILTER() {
    return this._startServerFILTER
  }

  // возвращает измененный Объект Фильтра
  public get FILTER() {
    return this._FILTER
  }


  // возвращает массив цен из стартовогоФильтра
  public get startPriceOfFILTER() {
    return this._startServerFILTER.price
  }
  // возвращает массив количества товаров из стартовогоФильтра
  public get startStockOfFILTER() {
    return this._startServerFILTER.stock
  }
  // возвращает  строкe поиска из стартовогоФильтра
  public get startSearchOfFILTER() {
    return this._startServerFILTER.search
  }

  // возвращает массив цен из Фильтра
  public get priceOfFILTER() {
    // this.updateFILTER_Price_Stock()
    return this._FILTER.price
  }
  // возвращает массив количества товаров из Фильтра
  public get stockOfFILTER() {
    // this.updateFILTER_Price_Stock()
    return this._FILTER.stock
  }
  // возвращает  строку поиска из Фильтра
  public get searchOfFILTER() {
    // this.updateFILTER_Price_Stock()
    return this._FILTER.search
  }

  // подметод для формирования стартовых Объектов категорий и бренда а также измененных
  // меняет по измененному filtredData
  private getCategoryAndBrandData(obj: string[],
    key: "brand" | "category",
    filtredData: IitemDATA[] = this.startServerData,
    filter = this._FILTER) {
    const result: stringArrayObject = {}

    obj.forEach((categoryValue) => {
      filtredData.forEach((product) => {
        if (!result[categoryValue]) result[categoryValue] = [0, 0, 0]
        if (product[key] === categoryValue) result[categoryValue][0] += 1
      })
    })

    obj.forEach((categoryValue) => {
      this.startServerData.forEach((product) => {
        if (!result[categoryValue]) result[categoryValue] = [0, 0, 0]
        if (product[key] === categoryValue) result[categoryValue][1] += 1
      })
    })

    filter.category.forEach((item) => {
      if (result[item]) {
        result[item][2] += 1
      }
    })


    filter.brand.forEach((item) => {
      if (result[item]) {
        result[item][2] += 1
      }
    })

    // console.log("100 = result", result)
    return result
  }

  // медод обновляющий отфильтрованный Объект c данными ПРОДУКТА по измененному FILTER
  updateFiltredData(): IitemDATA[] {
    let resultfilterData: IitemDATA[] = this.startServerData.slice()
    // console.log("769 =resultfilterData", resultfilterData)
    // console.log("770 =this.FILTER", this.FILTER)
    resultfilterData = resultfilterData.filter((product) => {
      if (this.FILTER.category.length === 0) return true
      if (this.FILTER.category.includes(product.category)) return true
      return false
    })
    // console.log("771 =resultfilterData", resultfilterData)

    resultfilterData = resultfilterData.filter((product) => {
      if (this.FILTER.brand.length === 0) return true
      if (this.FILTER.brand.includes(product.brand)) return true
      return false
    })
    // console.log("772 =resultfilterData", resultfilterData)

    resultfilterData = resultfilterData.filter((product) => {
      this.FILTER.price.sort((a, b) => a - b)
      if ((this.FILTER.price[1] - this.FILTER.price[0]) === (this.startServerFILTER.price[1] - this.startServerFILTER.price[0])) return true
      if (this.FILTER.price[0] <= product.price && product.price <= this.FILTER.price[1]) {
        return true
      }
      return false
    })
    // console.log("773 =resultfilterData", resultfilterData)


    resultfilterData = resultfilterData.filter((product) => {
      this.FILTER.stock.sort((a, b) => a - b)
      if ((this.FILTER.stock[1] - this.FILTER.stock[0]) === (this.startServerFILTER.stock[1] - this.startServerFILTER.stock[0])) return true
      if (this.FILTER.stock[0] <= product.stock && product.stock <= this.FILTER.stock[1]) {
        return true
      }
      return false
    })
    // console.log("774 =resultfilterData", resultfilterData)

    resultfilterData = resultfilterData.filter((product) => {

      const text = this.FILTER.search[0]

      if (text === '') return true
      if (product.title.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.description.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.price.toString().includes(text) ||
        product.discountPercentage.toString().includes(text) ||
        product.rating.toString().includes(text) ||
        product.stock.toString().includes(text) ||
        product.brand.toLocaleLowerCase().includes(text.toLocaleLowerCase()) ||
        product.category.toLocaleLowerCase().includes(text.toLocaleLowerCase())
      ) { return true }
      return false
    })
    // console.log("777 =resultfilterData", resultfilterData)

  
    resultfilterData.sort((product1, product2) => product1.title.toLowerCase() > product2.title.toLowerCase() ? 1:-1)
    if (this.FILTER.sort[0] === "CBA") {resultfilterData.reverse()}
    if (this.FILTER.sort[0] === "Sort by Price low")  {
      resultfilterData.sort((product1, product2) => product1.price - product2.price)
    }
    if (this.FILTER.sort[0] === "Sort by Price up") {
      resultfilterData.sort((product1, product2) => product2.price - product1.price)
    }
    if (this.FILTER.sort[0] === "Sort by Rating low") {
      resultfilterData.sort((product1, product2) => product1.rating - product2.rating)
    }
    if (this.FILTER.sort[0] === "Sort by Rating up") {
      resultfilterData.sort((product1, product2) => product2.rating - product1.rating)
    }

    this._filtredData = resultfilterData

    // this.startCategoryData
    // this.startBrandData
    return this._filtredData
  }
  // Метод очищающий Объект фильтра до стартового
  // и обновляющий отфильтрованный Объект c данными ПРОДУКТА
  clearFILTER() {
    this._FILTER.category = []
    this._FILTER.brand = []
    this._FILTER.price = this.baseData.price,
    this._FILTER.stock = this.baseData.stock,
    this._FILTER.search = ['']
    this._FILTER.sort = ['']

    // this._FILTER = JSON.parse(JSON.stringify(this._startServerFILTER))
    this.updateFiltredData()
  }

}

export default CreateFilterData


// const App = new CreateFilterData()


// function returnObjForURLSearch(obj: IFilter) {
//   const result: stringObject = {}
//   let prop: keyof typeof obj
//   for (prop in obj) {
//     result[prop] = obj[prop].join("|")
//   }
//   return result
// }

// console.log("77", returnObjForURLSearch(App.FILTER))


// const params = new URLSearchParams(returnObjForURLSearch(App.FILTER))


// // window.history.pushState({}, '', `?${params.toString()}`)
// window.history.pushState({}, '', `?id=${2}`)
// // window.history.pushState({}, '', `/watch1?${params.toString()}`)
// // window.history.pushState({}, '', `/watch2?${params.toString()}`)
// // window.history.pushState({}, '', `/watch3?${params.toString()}`)
// console.log("80 =window.location.search =", window.location.search)


// const ABC: { [x: string]: string[] } = {}

// for (const [key, value] of params.entries()) {
//   // console.log("100=", key, value)
//   ABC[key] = value.split("|")
// }

// console.log("ABC ВЕРНУЛ из строки= ", ABC)




// // console.log("10",App.serverData)
// console.log("20", App.filtredData)
// console.log("30",App.serverFILTER)
// console.log("40", App.FILTER)

// // App.clearFILTER()

// App.FILTER.category.push("smartphones")
// // App.FILTER.search[0] = "Lo"
// App.updateFiltredData()
// // App.categoryData()

// // console.log("50",App.serverData)
// console.log("60", App.filtredData)
// // console.log("70",App.serverFILTER)
// console.log("80 App.FILTER =", App.FILTER)

// // App.clearFILTER()

// // console.log("90",App.serverData)
// console.log("100", App.filtredData)
// // console.log("110",App.serverFILTER)
// console.log("120", App.FILTER)


// // console.log("App.baseData.brand", App.baseData.brand)
// // console.log("App.categoryArray", App.categoryArray)
// console.log("App.brandData", App.brandData)
// console.log("App.categoryData", App.categoryData)


// App.clearFILTER()

// console.log("App.brandData", App.brandData)
// console.log("App.categoryData", App.categoryData)






































// for (const value of params.values()) {
//   console.log("200",value)
// }

// function updateURL() {
//   if (history.pushState) {
//       const baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
//       const newUrl = baseUrl + '?tyapk=awesome';
//       history.pushState(null, "", newUrl);
//   }
//   else {
//       console.warn('History API не поддерживается');
//   }
// }

// window.onpopstate = updateURL;

// window.history.pushState({},'',params.toString())


// console.log(window.location.search)
// console.log(window.location.origin)


// window.location.assign(
//   `${window.location.origin}${window.location.pathname}?${params.toString()}`
// )






// const route = (event: Event) => {
//   event = event || window.event;
//   event.preventDefault();
//   window.history.pushState({}, "", params.toString());
//   handleLocation();
// };

// const routes = {
//   404: "/pages/404.html",
//   "/": "/pages/index.html",
//   "/about": "/pages/about.html",
//   "/lorem": "/pages/lorem.html",
// };

// const handleLocation = async () => {
//   const path = window.location.pathname;
//   const route = routes[path] || routes[404];
//   const html = await fetch(route).then((data) => data.text());
//   document.getElementById("main-page").innerHTML = html;
// };

// window.onpopstate = handleLocation;
// window.route = route;

// handleLocation();



//   changeFiltredData(obj = this._FILTER): IitemDATA[] {
//     let filterData: IitemDATA[] = []

//     filterData = this._serverData.filter((item) => {
//       let keyObj: keyof typeof this.FILTER
//       for (keyObj in obj) {
//         if (keyObj === "category") {
//           let keyObjCategory: keyof typeof this.FILTER.category
//           for (keyObjCategory in this.FILTER.category) {
//             if (this.FILTER.category[keyObjCategory] && item.category === keyObjCategory) return true
//           }
//         }
//         if (keyObj === "brand") {
//           let keyObjBrand: keyof typeof this.FILTER.brand
//           for (keyObjBrand in this.FILTER.brand) {
//             if (this.FILTER.brand[keyObjBrand] && item.brand === keyObjBrand) return true
//           }
//         }
//         if (keyObj === "price") {
//           this.FILTER.price.sort((a, b) => a - b)
//           if (this.FILTER.price[0] <= item.price && item.price <= this.FILTER.price[1]) return true
//         }
//         if (keyObj === "stock") {
//           this.FILTER.stock.sort((a, b) => a - b)
//           if (this.FILTER.stock[0] <= item.stock && item.stock <= this.FILTER.stock[1]) return true
//         }
//       }
//       return false
//     })
//     this._filtredData = filterData
//     return this._filtredData
//   }