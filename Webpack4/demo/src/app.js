import './styl.css'
import txt from './foo.txt'

console.log(global);
console.log(process);
console.log(__filename)

;
(function () {
  let app = document.getElementById('app'),
    div1 = document.createElement('div')
  div1.innerHTML = 'Hello World!'
  div1.className = 'my_div'
  app.appendChild(div1);

  let div2 = document.getElementById('raw-loader')
  div2.innerHTML = txt
})()