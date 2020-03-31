
function setStorage(key, value, time) {
  let currentTime = new Date().getTime()
  // 设置过期时间 (7天) 7 * 24 * 60 * 60 * 1000
  localStorage.setItem(key, JSON.stringify({data: value, time: currentTime + time}))
}

function getStorage(key) {
  if (!localStorage.getItem(key)) return
  let dataObj = JSON.parse(localStorage.getItem(key))
  if (new Date().getTime() > dataObj.time) {
    // TODO
    return null;
  } else {
    return dataObj.data
  }
}

function removeStorage(key) {
  localStorage.removeItem(key)
}

export { setStorage, getStorage, removeStorage};
