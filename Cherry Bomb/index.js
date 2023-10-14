// 首页获取时间
(function () {
  const nowTime = document.querySelector('.nowtime')
  const date = new Date
  nowTime.innerHTML = date.toLocaleString()
  setInterval(() => {
    const loaclDate = new Date
    nowTime.innerHTML = loaclDate.toLocaleString()
  }, 1000)
})();

// 添加侧边栏点击事件
(function () {
  // 获取 <ul> 元素
  const ulElement = document.querySelector('.sidebar-menu');

  // 添加事件监听器到 <ul> 上
  ulElement.addEventListener('click', function (e) {
    // e.preventDefault()

    // 检查点击事件的目标元素是否是 <li> 元素
    if (e.target.tagName === 'A' && e.target.childNodes.length !== 1) {

      // 检查目标元素是否包含 "dropdown" 类
      if (e.target.parentNode.classList.contains('dropdown')) {
        // 移除之前的所有不带有 "dropdown" 类的 <li> 上的 "active" 类
        const nonDropdownLiElements = document.querySelectorAll('.sidebar-menu li:not(.dropdown)')
        nonDropdownLiElements.forEach((liElement) => {
          liElement.classList.remove('active')
        });

        // 如果是带有 "dropdown" 类的 <li>
        if (e.target.parentNode.classList.contains('active')) {
          // 如果已经有 "active" 类，则移除它
          e.target.parentNode.classList.remove('active')
        } else {
          // 否则，添加 "active" 类
          e.target.parentNode.classList.add('active')
        }

      }
      else {
        // // 移除之前所有<li> 上的 "active" 类
        const nonDropdownLiElements = document.querySelectorAll('.sidebar-menu .active')
        nonDropdownLiElements.forEach((liElement) => {
          liElement.classList.remove('active')
        });

        // 将 "active" 类添加到点击的 <li> 上
        e.target.parentNode.classList.add('active')
      }
    }
  });
})();

// iframe动态获取高度
function getDocHeight(doc) {
  doc = doc || document;
  var body = doc.body;
  var html = doc.documentElement;
  var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  return height;
};

function setIframeHeight(id) {
  var ifrm = document.getElementById(id);
  var doc = ifrm.contentDocument ? ifrm.contentDocument : ifrm.contentWindow.document;
  ifrm.style.visibility = 'hidden';
  ifrm.style.height = "10px";     // reset to minimal height ...
  ifrm.style.height = getDocHeight(doc) + 4 + "px";
  ifrm.style.visibility = 'visible';
};

// pdf文件路径
const pdfPath = {
  MD教学: './素材/markdown操作指南👍.pdf'
};

// 通过点击链接，改变中心区内容
(function () {
  // 获取侧边栏链接列表
  const sidebarLink = document.querySelector('.sidebar-menu')

  // 获取 内容区 元素
  const mainContent = document.querySelector('.main-content')

  // 获取 标题 元素
  const topBar = document.querySelector('.topbar')

  // 为每个链接添加点击事件处理程序
  sidebarLink.addEventListener('click', (e) => {
    e.preventDefault()
    if (e.target.tagName === 'A' && e.target.href) {
      topBar.innerHTML = `${e.target.dataset.page}`

      // 首页部分
      if (e.target.dataset.page === '首页') {
        location.href = './Cherry Bomb.html'
      }

      // To Do List
      else if (e.target.dataset.page === 'To Do List') {
        mainContent.innerHTML = `
        <!-- To Do List -->
        <div class="TDL init">

            <!-- 左半计数部分 -->
            <div class="TDL-sum">
                <i class="iconfont" id="openModalButton">&#xe62f;</i>
                <span></span>
            </div>

            <!-- 右半内容部分 -->
            <div class="TDL-content">   
            </div>

        </div>
        `
        TDLRender()
        TDLHide()
      }

      else {
        if (e.target.href.slice(-3) === 'pdf') {

          // 设置 PDF 文件的路径
          const path = pdfPath[e.target.dataset.page] // 将此路径替换为你的 PDF 文件路径

          let iframeHeight = 0

          // 使用 PDF.js 加载 PDF 文件
          pdfjsLib.getDocument(path).promise.then(function (pdf) {
            // 获取 PDF 文件的页面数量
            const numPages = pdf.numPages;

            // 计算整个 PDF 文件的高度
            let totalHeight = 0;

            function renderPage(pageNumber) {
              return pdf.getPage(pageNumber).then(function (page) {
                const viewport = page.getViewport({ scale: 1 });
                totalHeight += viewport.height;
                if (pageNumber < numPages) {
                  return renderPage(pageNumber + 1);
                } else {
                  // 设置 <iframe> 的高度为整个 PDF 文件的高度
                  iframeHeight = totalHeight + 'px';
                  mainContent.innerHTML = `
                <iframe class="init" src=${e.target.href} frameborder="0" scrolling="no" width="100%" height=${iframeHeight}></iframe>
                `
                }
              });
            }

            // 开始逐页渲染 PDF 文件并计算高度
            return renderPage(1);
          });

        }
        else {
          mainContent.innerHTML = `
        <iframe class="init" id="my-iframe" src=${e.target.href} frameborder="0" scrolling="no" width="100%"
                  onload="setIframeHeight(this.id)"></iframe>
        `
        }
      }
    }
  })

})();

// To Do List
function TDL() {
  // 左半计数部分
  const TDLSum = document.querySelector('.TDL-sum span');

  // 右半内容部分
  const TDLContent = document.querySelector('.TDL-content');

  const TDLCheckboxSpans = document.querySelectorAll('.TDL-checkbox span');

  // 初始化待办事项计数
  TDLSum.innerHTML = TDLCheckboxSpans.length;

  // 点击勾勾删除事项
  TDLContent.addEventListener('click', (e) => {
    if (e.target.tagName === 'I') {
      // 获取要添加删除线的 <span> 元素
      const spanElement = TDLCheckboxSpans[e.target.dataset.id];

      if (spanElement) {
        // 添加删除线样式和颜色
        e.target.style.color = spanElement.style.color = 'green'
        spanElement.style.textDecoration = 'line-through';

        // 延迟一段时间后处理删除事项
        setTimeout(() => {
          // 删除对应的 <span> 元素
          spanElement.parentNode.remove();

          // 更新待办事项计数
          TDLSum.innerHTML = document.querySelectorAll('.TDL-checkbox').length;

          // 获取本地存储中的待办事项数据
          const contentData = JSON.parse(localStorage.getItem('TDLcontent'));
          console.log(contentData);

          contentData.splice(e.target.dataset.id, 1)
          console.log(contentData);

          // if (contentData.length === 0) {
          //   // // 如果数组为空，从 localStorage 中删除数据
          //   // localStorage.removeItem('TDLcontent');
          //   console.log(111);
          // } 
          // else {
          //   // 否则，更新 localStorage 中的数据
          //   localStorage.setItem('TDLcontent', JSON.stringify(updatedContentDataArray));
          // }


          const updatedContentData = contentData.map((ele, index) => {
            // 将原来的字符串改成对象
            const updatedEle = [...ele]; // 创建元素的副本以确保不修改原始数组
            updatedEle[67] = String(index);
            // 再将对象改成字符串
            return updatedEle.join('');
          });
          // console.log(typeof(updatedContentData))
          localStorage.setItem('TDLcontent', JSON.stringify(updatedContentData))

        }, 1000)
      }
    }
  })
};

// To Do List 遮罩层
function TDLHide() {

  const openModalButton = document.querySelector('#openModalButton')
  const closeModalButton = document.querySelector('#closeModalButton')
  const modalOverlay = document.querySelector('#modalOverlay')
  const modalContainer = document.querySelector('#modalContainer')
  const textModal = document.querySelector('#textModal')
  const saveModalButton = document.querySelector('#saveModalButton')

  // 打开模态框
  openModalButton.addEventListener('click', () => {
    modalOverlay.style.display = 'block';
    modalContainer.style.display = 'block';
    textModal.value = ''
    textModal.focus()

  });

  // 关闭模态框
  closeModalButton.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    modalContainer.style.display = 'none';
  });

  // 保存模态框
  saveModalButton.addEventListener('click', () => {

    modalOverlay.style.display = 'none';
    modalContainer.style.display = 'none';

    // 存储字符串
    const TDLData = JSON.parse(localStorage.getItem('TDLcontent')) || []
    TDLData.push(`
    <div class="TDL-checkbox">
      <i class="iconfont" data-id="${TDLData.length}">&#xe713;</i>
      <span>${textModal.value}</span>
    </div>
    `)
    localStorage.setItem('TDLcontent', JSON.stringify(TDLData))

    TDLRender()
  });

  // 点击回车保存 & esc退出   
  textModal.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') saveModalButton.click()
    else if (e.key === 'Escape') {
      closeModalButton.click()
    }
  })

};

// TDL内容渲染
function TDLRender() {
  const TDLData = JSON.parse(localStorage.getItem('TDLcontent')) || []

  document.querySelector('.TDL-content').innerHTML = TDLData.join('')

  TDL()
}