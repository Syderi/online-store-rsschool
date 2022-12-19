import ControllerMain from "../controller/_ControllerMain";
import { stringArrayObject } from '../typingTS/_type'
import Router from "../router";

class ViewFooter {
  _controller: ControllerMain;
  _router: Router;
  root: HTMLElement;
  startCategoryData: stringArrayObject

  constructor() {
    this.root = document.body;
    this._controller = new ControllerMain();
    this.startCategoryData = this._controller.startCategoryData


    // this.root.onclick = () => {console.log(this.startCategoryData)}


    this._router = new Router()

    this._router.startRouteListenner()
    this._router.handleLocation()

    // this._controller.router.startRouteListenner()
    // console.log("this._controller.router.count",this._controller.router.count)
  }

  createFooter() {

    const footer: HTMLElement = document.createElement("footer")

    footer.innerHTML = `<footer class="page-footer _main-container">
  <section class="footer _container">
    <div class="footer__item github">
      <div class="footer__link-container">
        <div class="footer__link-container-item">
          <a href="https://github.com/Jik789" class="footer__link footer__github"></a>
          <p class="footer__author">JiK789</p>
        </div>
        <div class="footer__link-container-item">
          <a href="https://github.com/syderi" class="footer__link footer__github"></a>
          <p class="footer__author">Syderi</p>
        </div>
      </div>
    </div>
    <p class="footer__item date-relese">2022</p>
    <div class="footer__item rsschool">
      <a href="https://rs.school/index.html" class="footer__link footer__rsschool"></a>
    </div>
  </section>
</footer>`

    footer.onclick = () => { this._router.pushState('/product') }

    this.root.append(footer)
  }

  createMain() {
    console.log("1")
  }

  init() {
    this.createFooter()
    // this._controller.router.startRouteListenner()

  }

}

export default ViewFooter