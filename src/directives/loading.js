import loadingImg from '@/assets/images/loading.gif'
export default {
  mounted(el, binding) {
    // 创建loading元素，添加到dom中
    const mask = document.createElement('div')
    mask.className = 'mask'
    const spinner = document.createElement('div')
    spinner.className = 'spinner'
    spinner.innerHTML = `<img src="${loadingImg}" />`
    mask.appendChild(spinner)
    el.appendChild(mask)
    setDomStyle(mask, {
      display: 'none',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.1)',
      'z-index': '999',
      transition: 'all 0.3s',
    })
    setDomStyle(spinner, {
      display: 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '40px',
      height: '40px',
      'text-align': 'center',
      transform: 'translate(-50%, -50%)',
    })
    setDomStyle(spinner.querySelector('img'), {
      width: '100%',
      height: '100%',
    })
    if (binding.value) {
      el.classList.add('relative')
      mask.style.display = 'block'
      spinner.style.display = 'block'
    }
  },
  updated(el, binding) {
    const mask = el.querySelector('.mask')
    const spinner = el.querySelector('.spinner')
    if (binding.value) {
      el.classList.add('relative')
      mask.style.display = 'block'
      spinner.style.display = 'block'
    }
    else {
      el.classList.remove('relative')
      mask.style.display = 'none'
      spinner.style.display = 'none'
    }
  },
  unmounted(el) {
    el.removeChild(el.querySelector('.mask'))
  }
}

function setDomStyle(dom, style) {
  for (let key in style) {

    dom.style[key] = style[key]
  }
}