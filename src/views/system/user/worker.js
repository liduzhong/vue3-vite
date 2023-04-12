const urls = ['/api/public/1678885579384.png', '/api/public/logo.png', '/api/public/logo.jpeg', '/api/public/icon-home-bg.png']
console.log(self);

function loadImg(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob'
    xhr.open('GET', url, true);
    xhr.onload = () => resolve(xhr.response)
    xhr.send()
  })
}

function blobToDataUrl(blob) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => resolve(reader.result)
  })
}

(async function (urls) {
  for (let url of urls) {
    const blob = await loadImg(url)
    postMessage(await blobToDataUrl(blob))
  }
})(urls);