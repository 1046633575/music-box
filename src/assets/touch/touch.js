import router from '../../router'
window.onload = function () {
  // 1. 理解移动端的手势事件
  // 2. swipe swipeLeft swipeRight swipeUp swipeDown
  // 3. 左滑和右滑手势怎么实现
  var bindSwipeEvent = function (dom, leftCallback, rightCallback) {
    // 手势的条件
    // 1.必须滑动过
    // 2.滑动的距离50px
    var isMove = false
    var startX = 0
    var distanceX = 0
    dom.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX
    })
    dom.addEventListener('touchmove', function (e) {
      isMove = true
      var moveX = e.touches[0].clientX
      distanceX = moveX - startX
      if (distanceX > 0) {
        document.querySelector('.rank-container').style = `transform: translateX(${distanceX}px)`
      } else {
        document.querySelector('.main-container').style = `transform: translateX(${distanceX}px)`
      }
    })
    dom.addEventListener('touchend', function (e) {
      // 滑动结束
      if (isMove && Math.abs(distanceX) > 50) {
        if (distanceX > 0) {
          rightCallback && rightCallback.call(this, e)
        } else {
          rightCallback && leftCallback.call(this, e)
        }
      } else {
        if (distanceX > 0) {
          document.querySelector('.rank-container').style = `transform: translateX(0)`
        } else {
          document.querySelector('.main-container').style = `transform: translateX(0)`
        }
      }

      // 重置参数
      isMove = false
      startX = 0
      distanceX = 0
    })
  }
  bindSwipeEvent(document.querySelector('#app'), function (e) {
    console.log('左滑手势')
    router.push({ path: '/rank' })
  }, function (e) {
    console.log('右滑手势')
    router.push({ path: '/' })
  })
}
